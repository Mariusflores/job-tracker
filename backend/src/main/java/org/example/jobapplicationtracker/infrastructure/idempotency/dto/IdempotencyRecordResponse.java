package org.example.jobapplicationtracker.infrastructure.idempotency.dto;

import org.example.jobapplicationtracker.infrastructure.idempotency.model.ActionType;


public record IdempotencyRecordResponse(
        String key,
        ActionType action,
        Long targetId,
        String payloadHash,
        String responseSnapshot
) {

}
