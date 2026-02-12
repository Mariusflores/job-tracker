package org.example.jobapplicationtracker.application.dto.response;

import org.example.jobapplicationtracker.application.model.ApplicationStatus;

import java.time.LocalDate;


public record ApplicationResponse(
        Long id,
        String jobTitle,
        String companyName,
        String descriptionUrl,
        ApplicationStatus status,
        LocalDate appliedDate,
        String notes

) {

}
