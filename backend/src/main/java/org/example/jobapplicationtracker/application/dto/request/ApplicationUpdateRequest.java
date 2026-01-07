package org.example.jobapplicationtracker.application.dto.request;

import jakarta.validation.constraints.PastOrPresent;
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
public class ApplicationUpdateRequest {
    private String jobTitle;
    private String companyName;
    private String descriptionUrl;
    private ApplicationStatus status;
    @PastOrPresent(message = "Applied date cannot be in the future")
    private LocalDate appliedDate;

}
