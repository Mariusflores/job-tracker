package org.example.jobapplicationtracker.infrastructure.idempotency.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.infrastructure.idempotency.dto.IdempotencyIntent;
import org.example.jobapplicationtracker.infrastructure.idempotency.dto.IdempotencyRecordResponse;
import org.example.jobapplicationtracker.infrastructure.idempotency.model.IdempotencyRecord;
import org.example.jobapplicationtracker.infrastructure.idempotency.repository.IdempotencyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyService {
    private final IdempotencyRepository repository;
    private final static Long EXPIRATION_TIME_MINUTES = 45L;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public IdempotencyRecordResponse loadExisting(String key, Long userId) {
        IdempotencyRecord record = repository.findByKeyAndUserId(key, userId);

        if (record == null) {
            throw new IllegalStateException(
                    "Idempotency conflict detected but no committed record exists for key=" + key
            );
        }

        return IdempotencyRecordResponse.builder()
                .key(key)
                .action(record.getActionType())
                .targetId(record.getTargetId())
                .payloadHash(record.getPayloadHash())
                .responseSnapshot(record.getResponseSnapshot())
                .build();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void tryReserve(IdempotencyIntent intent) {

        IdempotencyRecord record = IdempotencyRecord.builder()
                .key(intent.getKey())
                .userId(intent.getUserId())
                .actionType(intent.getAction())
                .targetId(intent.getTargetId())
                .payloadHash(intent.getPayloadHash())
                .responseSnapshot(null)
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_TIME_MINUTES))
                .build();

        repository.save(record);
    }

    public void complete(String key, Long userId, Long targetId, String responseSnapshot) {
        IdempotencyRecord record = repository.findByKeyAndUserId(key, userId);

        if (record == null) {
            throw new IllegalStateException(
                    "Cannot complete idempotency record that was not reserved: " + key
            );
        }
        record.setTargetId(targetId);
        record.setResponseSnapshot(responseSnapshot);

        repository.save(record);

    }

}
