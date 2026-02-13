package org.example.jobapplicationtracker.application.dto.response;

import org.example.jobapplicationtracker.application.model.ApplicationStatus;

import java.time.LocalDateTime;


public record StatusChangeResponse(
        Long id,
        Long applicationId,
        ApplicationStatus fromStatus,
        ApplicationStatus toStatus,
        LocalDateTime changedAt
) {


}
