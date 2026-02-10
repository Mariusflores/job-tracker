package org.example.jobapplicationtracker.infrastructure.idempotency.cleanup;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.idempotency.repository.IdempotencyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class IdempotencyCleanupJob {

    private final IdempotencyRepository repository;

    @Transactional
    @Scheduled(cron = "0 0 * * * *") // every hour
    public void cleanup() {
        repository.deleteExpired(LocalDateTime.now());
    }
}
