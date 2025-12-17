package org.example.jobapplicationtracker.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.application.dto.ApplicationRequest;
import org.example.jobapplicationtracker.application.dto.ApplicationResponse;
import org.example.jobapplicationtracker.application.error.ApplicationNotFoundException;
import org.example.jobapplicationtracker.application.model.Application;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class ApplicationService {

    private final ApplicationRepository applicationRepository;


    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request) {
        Application application = Application.builder()
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .descriptionUrl(request.getDescriptionUrl())
                .status(request.getStatus())
                .appliedDate(request.getAppliedDate())
                .notes(request.getNotes())
                .build();

        Application savedApplication = applicationRepository.save(application);
        return mapToApplicationResponse(savedApplication);
    }

    public List<ApplicationResponse> getAllApplications() {

        List<Application> applications = applicationRepository.findAll();


        return applications.stream().map(this::mapToApplicationResponse).toList();


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

    @Transactional
    public void updateApplication(Long id, ApplicationRequest applicationRequest) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

        if (applicationRequest.getJobTitle() != null && !applicationRequest.getJobTitle().equals(application.getJobTitle())) {
            application.setJobTitle(applicationRequest.getJobTitle());
        }
        if (applicationRequest.getCompanyName() != null && !applicationRequest.getCompanyName().equals(application.getCompanyName())) {
            application.setCompanyName(applicationRequest.getCompanyName());
        }
        if (applicationRequest.getDescriptionUrl() != null && !applicationRequest.getDescriptionUrl().equals(application.getDescriptionUrl())) {
            application.setDescriptionUrl(applicationRequest.getDescriptionUrl());
        }
        if (applicationRequest.getStatus() != null && !applicationRequest.getStatus().equals(application.getStatus())) {
            application.setStatus(applicationRequest.getStatus());
        }
        if (applicationRequest.getAppliedDate() != null && !applicationRequest.getAppliedDate().equals(application.getAppliedDate())) {
            application.setAppliedDate(applicationRequest.getAppliedDate());
        }
        if (applicationRequest.getNotes() != null && !applicationRequest.getNotes().equals(application.getNotes())) {
            application.setNotes(applicationRequest.getNotes());
        }
        try {
            applicationRepository.save(application);
        } catch (Exception e) {
            log.error("Error while saving application", e);
        }

    }

    public void deleteApplication(Long id) {
        try {
            applicationRepository.deleteById(id);
        } catch (ApplicationNotFoundException e) {
            log.error("Could not find application with id: " + id);
        }
    }

    public void updateApplicationStatus(Long id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

        application.setStatus(status);

        try {
            applicationRepository.save(application);
        } catch (Exception e) {
            log.error("Error while saving application", e);
        }
    }

    public void updateApplicationNotes(long id, String notes) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Could not find application with id: " + id));

        application.setNotes(notes);
        try {
            applicationRepository.save(application);
        } catch (Exception e) {
            log.error("Error while saving application", e);
        }

    }
}
