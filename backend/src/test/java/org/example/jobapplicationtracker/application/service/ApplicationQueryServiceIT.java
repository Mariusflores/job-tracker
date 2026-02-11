package org.example.jobapplicationtracker.application.service;

import org.example.jobapplicationtracker.application.dto.pagination.ApplicationPageResponse;
import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.example.jobapplicationtracker.infrastructure.auth.repository.UserRepository;
import org.example.jobapplicationtracker.infrastructure.idempotency.repository.IdempotencyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@WithMockUser(username = "test@example.com")
public class ApplicationQueryServiceIT {
    @Autowired
    private ApplicationQueryService queryService;

    @Autowired
    private ApplicationCommandService commandService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IdempotencyRepository idempotencyRepository;

    @BeforeEach
    void clean() {
        applicationRepository.deleteAll();
        userRepository.deleteAll();
        idempotencyRepository.deleteAll();

        userRepository.save(
                User.builder()
                        .email("test@example.com")
                        .password("dummy") // password irrelevant for @WithMockUser
                        .firstName("Test")
                        .lastName("User")
                        .build()
        );
    }

    @AfterEach
    void resetSecurity() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void firstPage_shouldReturnLimitAndNextCursor() {
        // Arrange
        seedApplications(5); // create 5 apps for current user

        // Act
        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(3, Optional.empty());

        // Assert
        assertThat(page.getContent()).hasSize(3);
        assertThat(page.isHasMore()).isTrue();
        assertThat(page.getNextCursor()).isNotNull();
    }

    @Test
    void secondPage_shouldReturnRemainingResults() {
        seedApplications(5);

        ApplicationPageResponse first =
                queryService.getNextApplicationsByCursor(3, Optional.empty());

        ApplicationPageResponse second =
                queryService.getNextApplicationsByCursor(
                        3,
                        Optional.of(first.getNextCursor())
                );

        assertThat(second.getContent()).hasSize(2);
        assertThat(second.isHasMore()).isFalse();
        assertThat(second.getNextCursor()).isNull();
    }

    @Test
    void exactLimit_shouldReturnSinglePage() {
        seedApplications(3);

        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(3, Optional.empty());

        assertThat(page.getContent()).hasSize(3);
        assertThat(page.isHasMore()).isFalse();
        assertThat(page.getNextCursor()).isNull();
    }

    @Test
    void emptyDataset_shouldReturnEmptyPage() {
        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(3, Optional.empty());

        assertThat(page.getContent()).isEmpty();
        assertThat(page.isHasMore()).isFalse();
        assertThat(page.getNextCursor()).isNull();
    }

    @Test
    @WithMockUser(username = "other@example.com")
    void userShouldOnlySeeOwnApplications() {

        userRepository.save(
                User.builder()
                        .email("other@example.com")
                        .password("dummy")
                        .firstName("Other")
                        .lastName("User")
                        .build()
        );

        seedApplications(3);

        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(10, Optional.empty());

        assertThat(page.getContent()).hasSize(3);
    }

    @Test
    void differentUsers_shouldNotSeeEachOthersApplications() {

        // seed for test@example.com
        seedApplications(3);

        // create other user
        userRepository.save(
                User.builder()
                        .email("other@example.com")
                        .password("dummy")
                        .firstName("Other")
                        .lastName("User")
                        .build()
        );

        // switch security context
        TestSecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "other@example.com",
                        null,
                        List.of()
                )
        );

        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(10, Optional.empty());

        assertThat(page.getContent()).isEmpty();
    }


    private void seedApplications(int count) {
        for (int i = 1; i <= count; i++) {
            commandService.createApplication(
                    ApplicationCreateRequest.builder()
                            .jobTitle("Job " + i)
                            .companyName("Company " + i)
                            .status(ApplicationStatus.APPLIED)
                            .appliedDate(LocalDate.of(2024, 1, i)) // deterministic
                            .build(),
                    "seed-key-" + i
            );
        }
    }

    @Test
    void shouldReturnApplicationsInCanonicalOrder_descDate_descId() {

        // Arrange
        // Same date to test ID tiebreaker
        commandService.createApplication(
                ApplicationCreateRequest.builder()
                        .jobTitle("Job A")
                        .companyName("Company A")
                        .status(ApplicationStatus.APPLIED)
                        .appliedDate(LocalDate.of(2024, 1, 1))
                        .build(),
                "seed-key-a"
        );

        commandService.createApplication(
                ApplicationCreateRequest.builder()
                        .jobTitle("Job B")
                        .companyName("Company B")
                        .status(ApplicationStatus.APPLIED)
                        .appliedDate(LocalDate.of(2024, 1, 1))
                        .build(),
                "seed-key-b"
        );

        commandService.createApplication(
                ApplicationCreateRequest.builder()
                        .jobTitle("Job C")
                        .companyName("Company C")
                        .status(ApplicationStatus.APPLIED)
                        .appliedDate(LocalDate.of(2024, 1, 2))
                        .build(),
                "seed-key-c"
        );

        // Act
        ApplicationPageResponse page =
                queryService.getNextApplicationsByCursor(10, Optional.empty());

        // Assert
        assertThat(page.getContent()).hasSize(3);

        // Extract dates
        List<LocalDate> dates = page.getContent()
                .stream()
                .map(ApplicationResponse::getAppliedDate)
                .toList();

        // Should be sorted descending
        assertThat(dates).isSortedAccordingTo((d1, d2) -> d2.compareTo(d1));

        // Verify ID tie-breaker on same date
        List<Long> ids = page.getContent()
                .stream()
                .map(ApplicationResponse::getId)
                .toList();

        // If two items share same date (2024-01-01),
        // the one created later (higher id) should come first
        assertThat(ids).isSortedAccordingTo((i1, i2) -> i2.compareTo(i1));
    }


}
