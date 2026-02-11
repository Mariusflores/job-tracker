package org.example.jobapplicationtracker.application.repository;

import jakarta.validation.constraints.NotNull;
import org.example.jobapplicationtracker.application.model.Application;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT a FROM Application a  " +
            "WHERE " +
            "(a.appliedDate < :appliedDate) " +
            "OR (a.appliedDate = :appliedDate AND a.id < :applicationId) " +
            "ORDER BY a.appliedDate desc, a.id desc")
    List<Application> findNextApplicationsByCursor(
            @Param("appliedDate") LocalDate appliedDate,
            @Param("applicationId") Long applicationId,
            Pageable pageable
    );

    @Query("SELECT a FROM Application a  " +
            "ORDER BY a.appliedDate desc, a.id desc")
    List<Application> findApplicationsInCanonicalOrder(Pageable pageable);

    boolean existsByIdAndUserId(@NotNull Long id, @NotNull Long userId);

    Optional<Application> findByIdAndUserId(@NotNull Long id, @NotNull Long userId);
}
