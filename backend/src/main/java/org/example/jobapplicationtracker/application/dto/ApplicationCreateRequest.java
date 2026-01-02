package org.example.jobapplicationtracker.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank
    private String jobTitle;
    @NotBlank
    private String companyName;
    private String descriptionUrl;
    @NotNull
    private ApplicationStatus status;
    @NotNull
    private LocalDate appliedDate;

}
