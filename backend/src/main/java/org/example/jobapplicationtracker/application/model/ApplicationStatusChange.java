package org.example.jobapplicationtracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "t_application_status_change",
        indexes = {
                @Index(name = "idx_status_change_application", columnList = "applicationId")
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationStatusChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long applicationId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ApplicationStatus toStatus;

    @CreatedDate
    @NotNull
    private LocalDateTime changedAt;
}
