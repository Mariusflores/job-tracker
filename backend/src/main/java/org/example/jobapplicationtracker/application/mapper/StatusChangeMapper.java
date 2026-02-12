package org.example.jobapplicationtracker.application.mapper;

import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;

public class StatusChangeMapper {
    public static StatusChangeResponse toStatusChangeResponse(ApplicationStatusChange applicationStatusChange) {
        return new StatusChangeResponse(
                applicationStatusChange.getId(),
                applicationStatusChange.getApplicationId(),
                applicationStatusChange.getFromStatus(),
                applicationStatusChange.getToStatus(),
                applicationStatusChange.getChangedAt()
        );
    }
}
