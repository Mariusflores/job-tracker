package org.example.jobapplicationtracker.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusChangeResponse {

    private Long id;
    private Long applicationId;
    private ApplicationStatus fromStatus;
    private ApplicationStatus toStatus;
    private LocalDateTime changedAt;

}
