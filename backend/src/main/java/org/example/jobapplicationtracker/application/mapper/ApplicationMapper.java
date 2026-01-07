package org.example.jobapplicationtracker.application.mapper;

import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.model.Application;


public class ApplicationMapper {
    private ApplicationMapper() {
    }

    public static ApplicationResponse toApplicationResponse(Application application) {

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
}
