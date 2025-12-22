package org.example.jobapplicationtracker.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationCreateRequest {
    private String jobTitle;
    private String companyName;
    private String descriptionUrl;
    private ApplicationStatus status;
    private LocalDate appliedDate;

}
