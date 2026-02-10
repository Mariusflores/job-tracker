package org.example.jobapplicationtracker.infrastructure.idempotency.repository;

import org.example.jobapplicationtracker.infrastructure.idempotency.model.IdempotencyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;


public interface IdempotencyRepository extends JpaRepository<IdempotencyRecord, Long> {

    @Modifying
    @Query("""
                DELETE FROM IdempotencyRecord r
                WHERE r.expiresAt < :now
            """)
    void deleteExpired(@Param("now") LocalDateTime now);

    IdempotencyRecord findByKey(String key);
}
