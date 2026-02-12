package org.example.jobapplicationtracker.application.mapper;

import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.model.Application;


public class ApplicationMapper {
    private ApplicationMapper() {
    }

    public static ApplicationResponse toApplicationResponse(Application application) {

        return new ApplicationResponse(
                application.getId(),
                application.getJobTitle(),
                application.getCompanyName(),
                application.getDescriptionUrl(),
                application.getStatus(),
                application.getAppliedDate(),
                application.getNotes()
        );


    }
}
