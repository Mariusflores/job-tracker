package org.example.jobapplicationtracker.application.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.request.ApplicationUpdateRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.error.ApplicationNotFoundException;
import org.example.jobapplicationtracker.application.model.Application;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.example.jobapplicationtracker.application.repository.StatusChangeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StatusChangeRepository statusChangeRepository;

    // Fetch data Methods

    public Page<ApplicationResponse> getApplications(Pageable pageable) {

        Page<Application> page = applicationRepository.findAll(pageable);

        log.debug(
                "Fetched page {} with {} applications",
                page.getNumber(),
                page.getNumberOfElements()
        );


        return page.map(this::mapToApplicationResponse);


    }

    public List<StatusChangeResponse> getStatusHistory(Long applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new ApplicationNotFoundException(
                    "Could not find application with id: " + applicationId
            );
        }


        List<ApplicationStatusChange> statusChanges = statusChangeRepository.findByApplicationIdOrderByChangedAtDesc(applicationId);

        log.debug("Fetched {} applications", statusChanges.size());

        return statusChanges
                .stream()
                .map(this::mapToStatusChangeResponse)
                .toList();
    }

    private StatusChangeResponse mapToStatusChangeResponse(ApplicationStatusChange applicationStatusChange) {
        return StatusChangeResponse.builder()
                .id(applicationStatusChange.getId())
                .applicationId(applicationStatusChange.getApplicationId())
                .fromStatus(applicationStatusChange.getFromStatus())
                .toStatus(applicationStatusChange.getToStatus())
                .changedAt(applicationStatusChange.getChangedAt())
                .build();
    }

    private ApplicationResponse mapToApplicationResponse(Application application) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .jobTitle(application.getJobTitle())
                .companyName(application.getCompanyName())
                .descriptionUrl(application.getDescriptionUrl())
                .appliedDate(application.getAppliedDate())
                .status(application.getStatus())
                .notes(application.getNotes())
                .build();

    }

    // Edit Data methods

    @Transactional
    public ApplicationResponse createApplication(@Valid ApplicationCreateRequest request) {
        log.info(
                "Creating application: company='{}', jobTitle='{}'",
                request.getCompanyName(),
                request.getJobTitle()
        );
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

        Application savedApplication = applicationRepository.save(application);
        log.info("Application created with id={}", savedApplication.getId());
        return mapToApplicationResponse(savedApplication);
    }

    @Transactional
    public void deleteApplication(Long id) {
        log.info("Deleting application id={}", id);

        if (!applicationRepository.existsById(id)) {
            throw new ApplicationNotFoundException("Could not find application with id: " + id);
        }

        // Manual Deletion of StatusChange items connected to Application
        // Might migrate to Flyway + DB level cascading at a later time
        statusChangeRepository.deleteAllByApplicationId(id);

        applicationRepository.deleteById(id);


    }


    @Transactional
    public ApplicationResponse updateApplication(Long id, @Valid ApplicationUpdateRequest applicationRequest) {

        log.info("Updating application id={}", id);

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


        return mapToApplicationResponse(application);

    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status) {

        log.info("Updating status for application id={} to {}", id, status);

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

        changeStatus(application, status);
        return mapToApplicationResponse(application);

    }

    @Transactional
    public ApplicationResponse updateApplicationNotes(long id, String notes) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

        if (notes == null || notes.isBlank()) {
            log.warn("Ignored empty notes update for application id={}", id);
            return mapToApplicationResponse(application);

        }

        log.info("Updating notes for application with id: {}", id);

        application.setNotes(notes.trim());

        return mapToApplicationResponse(application);

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
}
