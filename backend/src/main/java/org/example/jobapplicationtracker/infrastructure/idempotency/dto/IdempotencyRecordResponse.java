package org.example.jobapplicationtracker.infrastructure.idempotency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.idempotency.model.ActionType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IdempotencyRecordResponse {
    private String key;
    private ActionType action;
    private Long targetId;
    private String payloadHash;
    private String responseSnapshot;
}
