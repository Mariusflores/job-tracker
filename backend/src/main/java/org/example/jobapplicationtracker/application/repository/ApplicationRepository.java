package org.example.jobapplicationtracker.application.repository;

import org.example.jobapplicationtracker.application.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}
