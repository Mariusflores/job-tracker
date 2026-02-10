package org.example.jobapplicationtracker.application.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.request.ApplicationUpdateRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.error.ApplicationNotFoundException;
import org.example.jobapplicationtracker.application.mapper.ApplicationMapper;
import org.example.jobapplicationtracker.application.model.Application;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.example.jobapplicationtracker.application.repository.StatusChangeRepository;
import org.example.jobapplicationtracker.infrastructure.idempotency.dto.IdempotencyIntent;
import org.example.jobapplicationtracker.infrastructure.idempotency.dto.IdempotencyRecordResponse;
import org.example.jobapplicationtracker.infrastructure.idempotency.hashing.HashingUtil;
import org.example.jobapplicationtracker.infrastructure.idempotency.model.ActionType;
import org.example.jobapplicationtracker.infrastructure.idempotency.service.IdempotencyService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j

public class ApplicationCommandService {

    private final ApplicationRepository applicationRepository;
    private final StatusChangeRepository statusChangeRepository;
    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;


    @Transactional
    public ApplicationResponse createApplication(@Valid ApplicationCreateRequest request) {
        String key = UUID.randomUUID().toString();// Dummy string, will be replaced with parameter
        ActionType action = ActionType.CREATE_APPLICATION; // Dummy
        log.info(
                "Creating application: company='{}', jobTitle='{}'",
                request.getCompanyName(),
                request.getJobTitle()
        );

        String canonicalPayload = generateCanonicalPayload(request, action);
        String payloadHash = HashingUtil.sha256(canonicalPayload);

        IdempotencyIntent intent = IdempotencyIntent.builder()
                .key(key)
                .action(action)
                .payloadHash(payloadHash)
                .targetId(null)
                .build();

        try {


            idempotencyService.tryReserve(intent);


            Application application = Application.builder()
                    .jobTitle(request.getJobTitle().trim())
                    .companyName(request.getCompanyName().trim())
                    .descriptionUrl(
                            request.getDescriptionUrl() != null
                                    ? request.getDescriptionUrl().trim()
                                    : null
                    )
                    .status(request.getStatus())
                    .appliedDate(request.getAppliedDate())
                    .build();


            Application responseApplication = applicationRepository.save(application);
            log.info("Application created with id={}", responseApplication.getId());

            String responseSnapshot = generateResponseSnapshot(responseApplication);

            // Store Record
            idempotencyService.complete(intent.getKey(), responseApplication.getId(), responseSnapshot);

            return ApplicationMapper.toApplicationResponse(responseApplication);
        } catch (DataIntegrityViolationException ex) {
            return handleIdempotentReplay(intent);
        }


    }

    @Transactional
    public void deleteApplication(Long id) {
        String key = UUID.randomUUID().toString();// Dummy string, will be replaced with parameter
        ActionType action = ActionType.DELETE_APPLICATION; // Dummy
        log.info("Deleting application id={}", id);

        String canonicalPayload = generateCanonicalPayload(id, action);
        String payloadHash = HashingUtil.sha256(canonicalPayload);

        IdempotencyIntent intent = IdempotencyIntent.builder()
                .key(key)
                .action(action)
                .payloadHash(payloadHash)
                .targetId(id)
                .build();

        try {
            idempotencyService.tryReserve(intent);

            if (!applicationRepository.existsById(id)) {
                throw new ApplicationNotFoundException("Could not find application with id: " + id);
            }


            // Manual Deletion of StatusChange items connected to Application
            // Might migrate to Flyway + DB level cascading at a later time
            statusChangeRepository.deleteAllByApplicationId(id);

            applicationRepository.deleteById(id);

            String responseSnapshot = generateDeleteSnapshot(id);

            idempotencyService.complete(intent.getKey(), id, responseSnapshot);


        } catch (DataIntegrityViolationException ex) {
            IdempotencyRecordResponse existing =
                    idempotencyService.loadExisting(intent.getKey());

            if (!existing.getPayloadHash().equals(intent.getPayloadHash())) {
                throw new IllegalStateException("Payload Hash Mismatch");
            }
            log.info("Delete already processed for id={}", id);
        }


    }


    @Transactional
    public ApplicationResponse updateApplication(Long id, @Valid ApplicationUpdateRequest applicationRequest) {

        String key = UUID.randomUUID().toString();// Dummy string, will be replaced with parameter
        ActionType action = ActionType.UPDATE_APPLICATION; // Dummy

        log.info("Updating application id={}", id);
        String canonicalPayload = generateCanonicalPayload(applicationRequest, action, id);
        String payloadHash = HashingUtil.sha256(canonicalPayload);

        IdempotencyIntent intent = IdempotencyIntent.builder()
                .key(key)
                .action(action)
                .payloadHash(payloadHash)
                .targetId(id)
                .build();

        try {
            idempotencyService.tryReserve(intent);

            Application application = applicationRepository.findById(id)
                    .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

            if (applicationRequest.getJobTitle() != null
                    && !applicationRequest.getJobTitle().isBlank()
                    && !applicationRequest.getJobTitle().equals(application.getJobTitle())) {
                log.debug("Updating jobTitle for application id={}", id);
                application.setJobTitle(applicationRequest.getJobTitle().trim());
            }
            if (applicationRequest.getCompanyName() != null
                    && !applicationRequest.getCompanyName().isBlank()
                    && !applicationRequest.getCompanyName().equals(application.getCompanyName())) {
                log.debug("Updating companyName for application id={}", id);
                application.setCompanyName(applicationRequest.getCompanyName().trim());
            }
            if (applicationRequest.getDescriptionUrl() != null
                    && !applicationRequest.getDescriptionUrl().equals(application.getDescriptionUrl())) {
                log.debug("Updating descriptionUrl for application id={}", id);
                application.setDescriptionUrl(applicationRequest.getDescriptionUrl().trim());
            }

            if (applicationRequest.getStatus() != null
                    && !applicationRequest.getStatus().equals(application.getStatus())) {
                changeStatus(application, applicationRequest.getStatus());
            }
            if (applicationRequest.getAppliedDate() != null
                    && !applicationRequest.getAppliedDate().equals(application.getAppliedDate())) {
                log.debug("Updating appliedDate for application id={}", id);
                application.setAppliedDate(applicationRequest.getAppliedDate());
            }

            String responseSnapshot = generateResponseSnapshot(application);

            idempotencyService.complete(intent.getKey(), id, responseSnapshot);


            return ApplicationMapper.toApplicationResponse(application);
        } catch (DataIntegrityViolationException ex) {
            return handleIdempotentReplay(intent);

        }


    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status) {
        String key = UUID.randomUUID().toString();// Dummy string, will be replaced with parameter
        ActionType action = ActionType.CHANGE_APPLICATION_STATUS; // Dummy

        log.info("Updating status for application id={} to {}", id, status);

        String canonicalPayload = generateCanonicalPayload(id, status, action);
        String payloadHash = HashingUtil.sha256(canonicalPayload);

        IdempotencyIntent intent = IdempotencyIntent.builder()
                .key(key)
                .action(action)
                .payloadHash(payloadHash)
                .targetId(id)
                .build();

        try {
            idempotencyService.tryReserve(intent);

            Application application = applicationRepository.findById(id)
                    .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));


            changeStatus(application, status);
            String responseSnapshot = generateResponseSnapshot(application);
            idempotencyService.complete(intent.getKey(), id, responseSnapshot);

            return ApplicationMapper.toApplicationResponse(application);
        } catch (DataIntegrityViolationException ex) {
            return handleIdempotentReplay(intent);
        }
    }

    @Transactional
    public ApplicationResponse updateApplicationNotes(long id, String notes) {
        String key = UUID.randomUUID().toString();// Dummy string, will be replaced with parameter
        ActionType action = ActionType.CHANGE_APPLICATION_NOTES; // Dummy

        String canonicalPayload = generateCanonicalPayload(id, notes, action);
        String payloadHash = HashingUtil.sha256(canonicalPayload);

        IdempotencyIntent intent = IdempotencyIntent.builder()
                .key(key)
                .action(action)
                .payloadHash(payloadHash)
                .targetId(id)
                .build();


        try {
            idempotencyService.tryReserve(intent);

            Application application = applicationRepository.findById(id)
                    .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));


            if (notes == null || notes.isBlank()) {
                log.warn("Ignored empty notes update for application id={}", id);
                String responseSnapshot = generateResponseSnapshot(application);
                idempotencyService.complete(intent.getKey(), id, responseSnapshot);
                return ApplicationMapper.toApplicationResponse(application);

            }

            log.info("Updating notes for application with id: {}", id);

            application.setNotes(notes.trim());
            String responseSnapshot = generateResponseSnapshot(application);
            idempotencyService.complete(intent.getKey(), id, responseSnapshot);

            return ApplicationMapper.toApplicationResponse(application);
        } catch (DataIntegrityViolationException ex) {
            return handleIdempotentReplay(intent);
        }
    }

    private void changeStatus(Application application, ApplicationStatus newStatus) {
        ApplicationStatus oldStatus = application.getStatus();

        if (oldStatus == newStatus) {
            return;
        }

        application.setStatus(newStatus);

        log.debug(
                "Application {} status changed: {} -> {}",
                application.getId(),
                oldStatus,
                newStatus
        );


        statusChangeRepository.save(
                ApplicationStatusChange.builder()
                        .applicationId(application.getId())
                        .fromStatus(oldStatus)
                        .toStatus(newStatus)
                        .build()
        );

    }

    private ApplicationResponse handleIdempotentReplay(IdempotencyIntent intent) {
        IdempotencyRecordResponse existing =
                idempotencyService.loadExisting(intent.getKey());

        if (!existing.getPayloadHash().equals(intent.getPayloadHash())) {
            throw new IllegalStateException("Payload Hash Mismatch");
        }
        return convertFromSnapshot(existing.getResponseSnapshot());
    }
    // Edit Data methods

    private String generateResponseSnapshot(Application application) {
        ApplicationResponse response = ApplicationMapper.toApplicationResponse(application);
        Map<String, Object> snapshot = new TreeMap<>();
        snapshot.put("id", application.getId());
        snapshot.put("jobTitle", application.getJobTitle());
        snapshot.put("companyName", application.getCompanyName());
        snapshot.put("descriptionUrl", application.getDescriptionUrl());
        snapshot.put("appliedDate", application.getAppliedDate());
        snapshot.put("status", application.getStatus());
        snapshot.put("notes", application.getNotes());

        return serializeJson(snapshot);
    }

    private String generateDeleteSnapshot(Long id) {
        Map<String, Object> snapshot = new TreeMap<>();
        snapshot.put("id", id);
        snapshot.put("deleted", true);

        return serializeJson(snapshot);
    }

    private ApplicationResponse convertFromSnapshot(String responseSnapshot) {

        try {
            Map<String, Object> snapshot = objectMapper.readValue(responseSnapshot, Map.class);

            if (snapshot.containsKey("deleted")) {
                throw new IllegalStateException("Delete snapshot cannot be converted to ApplicationResponse");
            }

            return ApplicationResponse.builder()
                    .id(((Number) snapshot.get("id")).longValue())
                    .jobTitle((String) snapshot.get("jobTitle"))
                    .companyName((String) snapshot.get("companyName"))
                    .descriptionUrl((String) snapshot.get("descriptionUrl"))
                    .status(ApplicationStatus.valueOf((String) snapshot.get("status")))
                    .appliedDate(LocalDate.parse((String) snapshot.get("appliedDate")))
                    .notes((String) snapshot.get("notes"))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize response snapshot", e);
        }
    }


    // For CREATE
    private String generateCanonicalPayload(ApplicationCreateRequest request, ActionType action) {
        // Use a sorted map to ensure consistent field ordering
        Map<String, Object> payload = new TreeMap<>();
        payload.put("action", action.name());
        payload.put("jobTitle", request.getJobTitle().trim());
        payload.put("companyName", request.getCompanyName().trim());
        payload.put("descriptionUrl", request.getDescriptionUrl() != null ? request.getDescriptionUrl().trim() : "null");
        payload.put("appliedDate", request.getAppliedDate().toString());
        payload.put("status", request.getStatus().name());

        return serializeJson(payload);
    }

    // For Update
    private String generateCanonicalPayload(ApplicationUpdateRequest request, ActionType action, Long targetId) {
        Map<String, Object> payload = new TreeMap<>();
        payload.put("action", action.name());
        payload.put("targetId", targetId.toString());

        //Only include fields that are being updated
        if (request.getJobTitle() != null && !request.getJobTitle().trim().isBlank()) {
            payload.put("jobTitle", request.getJobTitle().trim());
        }
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isBlank()) {
            payload.put("companyName", request.getCompanyName().trim());
        }
        if (request.getDescriptionUrl() != null && !request.getDescriptionUrl().trim().isBlank()) {
            payload.put("descriptionUrl", request.getDescriptionUrl().trim());
        }
        if (request.getAppliedDate() != null) {
            payload.put("appliedDate", request.getAppliedDate().toString());
        }
        if (request.getStatus() != null) {
            payload.put("status", request.getStatus().name());
        }
        return serializeJson(payload);
    }

    // For DELETE
    private String generateCanonicalPayload(Long targetId, ActionType action) {
        Map<String, Object> payload = new TreeMap<>();
        payload.put("action", action.name());
        payload.put("targetId", targetId.toString());
        return serializeJson(payload);
    }

    // For STATUS_UPDATE
    private String generateCanonicalPayload(Long targetId, ApplicationStatus status, ActionType action) {
        Map<String, Object> payload = new TreeMap<>();
        payload.put("action", action.name());
        payload.put("targetId", targetId.toString());
        payload.put("status", status.name());
        return serializeJson(payload);
    }

    //For NOTES_UPDATE

    private String generateCanonicalPayload(Long targetId, String notes, ActionType action) {
        Map<String, Object> payload = new TreeMap<>();
        payload.put("action", action.name());
        payload.put("targetId", targetId.toString());
        payload.put("notes", notes);
        return serializeJson(payload);
    }


    private String serializeJson(Map<String, Object> data) {
        try {
            // TreeMap ensures alphabetical ordering
            return objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize payload", e);
        }
    }


}
