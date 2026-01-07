package org.example.jobapplicationtracker.application.mapper;

import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;

public class StatusChangeMapper {
    public static StatusChangeResponse toStatusChangeResponse(ApplicationStatusChange applicationStatusChange) {
        return StatusChangeResponse.builder()
                .id(applicationStatusChange.getId())
                .applicationId(applicationStatusChange.getApplicationId())
                .fromStatus(applicationStatusChange.getFromStatus())
                .toStatus(applicationStatusChange.getToStatus())
                .changedAt(applicationStatusChange.getChangedAt())
                .build();
    }
}
