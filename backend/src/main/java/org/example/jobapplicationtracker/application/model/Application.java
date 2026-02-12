package org.example.jobapplicationtracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;

import java.time.LocalDate;

@Entity
@Table(name = "t_applications")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @NotBlank
    private String jobTitle;

    @Column(nullable = false)
    @NotBlank
    private String companyName;

    private String descriptionUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @NotNull
    @Builder.Default
    private LocalDate appliedDate = LocalDate.now();

    private String notes;
}
