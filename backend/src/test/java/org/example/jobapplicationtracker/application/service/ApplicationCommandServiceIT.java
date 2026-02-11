package org.example.jobapplicationtracker.application.service;

import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.request.ApplicationUpdateRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.example.jobapplicationtracker.infrastructure.idempotency.repository.IdempotencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ApplicationCommandServiceIT {

    @Autowired
    private ApplicationCommandService service;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private IdempotencyRepository idempotencyRepository;

    @BeforeEach
    void setUp() {
        idempotencyRepository.deleteAll();
        applicationRepository.deleteAll();
    }

    // 🧪 Test 1: CREATE is idempotent
    @Test
    void create_withSameKeyAndPayload_shouldReturnSameResult() {
        // Arrange
        ApplicationCreateRequest request = ApplicationCreateRequest.builder()
                .jobTitle("Software Engineer")
                .companyName("Acme Corp")
                .descriptionUrl("https://example.com/job")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        String idempotencyKey = "test-key-1";

        // Act
        ApplicationResponse response1 = service.createApplication(request, idempotencyKey);
        ApplicationResponse response2 = service.createApplication(request, idempotencyKey);

        // Assert
        assertThat(response1.getId()).isEqualTo(response2.getId());
        assertThat(response1.getJobTitle()).isEqualTo(response2.getJobTitle());
        assertThat(response1.getCompanyName()).isEqualTo(response2.getCompanyName());

        // Only one record in database
        assertThat(applicationRepository.count()).isEqualTo(1);

        // Idempotency record exists
        assertThat(idempotencyRepository.count()).isEqualTo(1);
    }

    // 🧪 Test 2: CREATE with same key + different payload fails
    @Test
    void create_withSameKeyButDifferentPayload_shouldThrowException() {
        // Arrange
        ApplicationCreateRequest request1 = ApplicationCreateRequest.builder()
                .jobTitle("Software Engineer")
                .companyName("Acme Corp")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationCreateRequest request2 = ApplicationCreateRequest.builder()
                .jobTitle("DevOps Engineer") // Different!
                .companyName("Different Corp") // Different!
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        String idempotencyKey = "test-key-2";

        // Act & Assert
        service.createApplication(request1, idempotencyKey);

        assertThatThrownBy(() -> service.createApplication(request2, idempotencyKey))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Payload Hash Mismatch");

        // Still only one record
        assertThat(applicationRepository.count()).isEqualTo(1);
    }

    // 🧪 Test 3: DELETE is idempotent
    @Test
    void delete_withSameKey_shouldBeIdempotent() {
        // Arrange
        ApplicationCreateRequest createRequest = ApplicationCreateRequest.builder()
                .jobTitle("Backend Developer")
                .companyName("Tech Startup")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationResponse created = service.createApplication(createRequest, "test-key-3-create");
        Long applicationId = created.getId();

        String deleteIdempotencyKey = "test-key-3-delete";

        // Act - delete twice
        service.deleteApplication(applicationId, deleteIdempotencyKey);
        service.deleteApplication(applicationId, deleteIdempotencyKey); // Should not throw

        // Assert
        assertThat(applicationRepository.existsById(applicationId)).isFalse();
        assertThat(applicationRepository.count()).isEqualTo(0);
    }

    // 🧪 Test 4: UPDATE notes is idempotent
    @Test
    void updateNotes_withSameContent_shouldBeIdempotent() {
        // Arrange - create application WITHOUT notes
        ApplicationCreateRequest createRequest = ApplicationCreateRequest.builder()
                .jobTitle("Frontend Developer")
                .companyName("Design Agency")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationResponse created = service.createApplication(createRequest, "test-key-4-create");
        Long applicationId = created.getId();

        String notesIdempotencyKey = "test-key-4-notes";

        // Act - add notes twice with same content
        String notes = "Had a great phone screen with the hiring manager";
        ApplicationResponse r1 = service.updateApplicationNotes(applicationId, notes, notesIdempotencyKey);
        ApplicationResponse r2 = service.updateApplicationNotes(applicationId, notes, notesIdempotencyKey);

        // Assert
        assertThat(r1.getNotes()).isEqualTo(notes);
        assertThat(r2.getNotes()).isEqualTo(notes);
        assertThat(r1.getId()).isEqualTo(r2.getId());
    }

    // 🧪 Test 5: UPDATE notes with empty/blank should be no-op
    @Test
    void updateNotes_withEmptyNotes_shouldBeNoOp() {
        // Arrange
        ApplicationCreateRequest createRequest = ApplicationCreateRequest.builder()
                .jobTitle("Backend Developer")
                .companyName("Tech Corp")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationResponse created = service.createApplication(createRequest, "test-key-5-create");
        Long applicationId = created.getId();

        // First add some notes
        service.updateApplicationNotes(applicationId, "Initial notes", "test-key-5-notes-1");

        // Act - try to update with empty notes
        ApplicationResponse r1 = service.updateApplicationNotes(applicationId, "   ", "test-key-5-notes-2");
        ApplicationResponse r2 = service.updateApplicationNotes(applicationId, "", "test-key-5-notes-3");

        // Assert - notes should remain unchanged
        assertThat(r1.getNotes()).isEqualTo("Initial notes");
        assertThat(r2.getNotes()).isEqualTo("Initial notes");
    }

    // 🧪 Test 6: UPDATE is idempotent
    @Test
    void update_withSameKeyAndPayload_shouldReturnSameResult() {
        // Arrange
        ApplicationCreateRequest createRequest = ApplicationCreateRequest.builder()
                .jobTitle("Data Engineer")
                .companyName("Data Corp")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationResponse created = service.createApplication(createRequest, "test-key-6-create");
        Long applicationId = created.getId();

        ApplicationUpdateRequest updateRequest = ApplicationUpdateRequest.builder()
                .jobTitle("Senior Data Engineer")
                .companyName("Data Corp")
                .status(ApplicationStatus.INTERVIEW)
                .build();

        String updateIdempotencyKey = "test-key-6-update";

        // Act
        ApplicationResponse r1 = service.updateApplication(applicationId, updateRequest, updateIdempotencyKey);
        ApplicationResponse r2 = service.updateApplication(applicationId, updateRequest, updateIdempotencyKey);

        // Assert
        assertThat(r1.getId()).isEqualTo(r2.getId());
        assertThat(r1.getJobTitle()).isEqualTo("Senior Data Engineer");
        assertThat(r2.getJobTitle()).isEqualTo("Senior Data Engineer");
        assertThat(r1.getStatus()).isEqualTo(ApplicationStatus.INTERVIEW);
    }

    // 🧪 Test 7: Status update is idempotent
    @Test
    void updateStatus_withSameKey_shouldBeIdempotent() {
        // Arrange
        ApplicationCreateRequest createRequest = ApplicationCreateRequest.builder()
                .jobTitle("Full Stack Developer")
                .companyName("Startup Inc")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();

        ApplicationResponse created = service.createApplication(createRequest, "test-key-7-create");
        Long applicationId = created.getId();

        String statusIdempotencyKey = "test-key-7-status";

        // Act - update status twice
        ApplicationResponse r1 = service.updateApplicationStatus(applicationId, ApplicationStatus.OFFER, statusIdempotencyKey);
        ApplicationResponse r2 = service.updateApplicationStatus(applicationId, ApplicationStatus.OFFER, statusIdempotencyKey);

        // Assert
        assertThat(r1.getStatus()).isEqualTo(ApplicationStatus.OFFER);
        assertThat(r2.getStatus()).isEqualTo(ApplicationStatus.OFFER);
        assertThat(r1.getId()).isEqualTo(r2.getId());
    }
}