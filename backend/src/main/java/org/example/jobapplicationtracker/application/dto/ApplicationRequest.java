package org.example.jobapplicationtracker.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationRequest {
    private String jobTitle;
    private String companyName;
    private String descriptionUrl;
    private ApplicationStatus status;
    private LocalDateTime appliedDate;

}
