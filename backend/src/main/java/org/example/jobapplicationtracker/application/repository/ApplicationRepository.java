package org.example.jobapplicationtracker.application.repository;

import org.example.jobapplicationtracker.application.model.Application;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT a FROM Application a  " +
            "WHERE " +
            "(a.appliedDate < :appliedDate) " +
            "OR (a.appliedDate = :appliedDate AND a.applicationId < :applicationId) " +
            "ORDER BY a.appliedDate desc, a.applicationId desc")
    public List<Application> findNextApplicationsByCursor(
            @Param("appliedDate") LocalDate appliedDate,
            @Param("applicationId") Long applicationId,
            Pageable pageable
    );
}
