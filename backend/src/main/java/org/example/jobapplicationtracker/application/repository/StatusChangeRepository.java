package org.example.jobapplicationtracker.application.repository;

import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusChangeRepository extends JpaRepository<ApplicationStatusChange, Long> {

    List<ApplicationStatusChange> findByApplicationIdOrderByChangedAtDesc(
            Long applicationId
    );

    void deleteAllByApplicationId(Long applicationId);
}
