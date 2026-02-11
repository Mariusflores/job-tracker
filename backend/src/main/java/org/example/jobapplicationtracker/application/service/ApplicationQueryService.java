package org.example.jobapplicationtracker.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.application.dto.pagination.ApplicationCursor;
import org.example.jobapplicationtracker.application.dto.pagination.ApplicationPageResponse;
import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.error.ApplicationNotFoundException;
import org.example.jobapplicationtracker.application.mapper.ApplicationMapper;
import org.example.jobapplicationtracker.application.mapper.StatusChangeMapper;
import org.example.jobapplicationtracker.application.model.Application;
import org.example.jobapplicationtracker.application.model.ApplicationStatusChange;
import org.example.jobapplicationtracker.application.repository.ApplicationRepository;
import org.example.jobapplicationtracker.application.repository.StatusChangeRepository;
import org.example.jobapplicationtracker.infrastructure.auth.context.SecurityContextCurrentUserProvider;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationQueryService {

    private final ApplicationRepository applicationRepository;
    private final StatusChangeRepository statusChangeRepository;
    private final SecurityContextCurrentUserProvider userProvider;


    // Fetch data Methods

    public ApplicationPageResponse getNextApplicationsByCursor(int limit, Optional<String> currentCursor) throws IllegalArgumentException {
        User user = userProvider.getCurrentUser();


        ///  Phase 1 - Interpret Input

        log.debug(
                "Fetching applications page: limit={}, cursorPresent={}",
                limit,
                currentCursor.isPresent()
        );

        currentCursor.ifPresent(c ->
                log.debug("Using cursor token: {}", c)
        );


        // Limit + 1 (+1 is evidence for further pages existing)
        Pageable pageable = PageRequest.of(0, limit + 1);

        List<Application> applications;

        if (currentCursor.isPresent()) {

            // Decode request
            ApplicationCursor cursor = ApplicationCursor.Decode(currentCursor.get());

            applications = applicationRepository.findNextApplicationsByCursor(cursor.getAppliedDate(), cursor.getApplicationId(), pageable);
        } else {
            applications = applicationRepository.findApplicationsInCanonicalOrder(pageable);

        }


        /// Phase 2

        log.debug(
                "Fetched {} applications (limit={}, evidenceExpected={})",
                applications.size(),
                limit,
                applications.size() > limit
        );
        // Return empty content if no more applications
        if (applications.isEmpty()) {
            log.debug("No applications found beyond cursor — returning terminal page");
            return ApplicationPageResponse.builder()
                    .content(List.of())
                    .nextCursor(null)
                    .hasMore(false)
                    .build();
        }


        boolean hasMore = applications.size() > limit;

        // Remove evidence from content
        applications.removeLast();

        // Encode nextCursor
        String nextCursor = null;
        if (hasMore) {

            Application cursorApplication = applications.getLast();
            log.debug(
                    "Derived next cursor from application id={}, appliedDate={}",
                    cursorApplication.getId(),
                    cursorApplication.getAppliedDate()
            );

            nextCursor = ApplicationCursor.Encode(
                    ApplicationCursor.builder()
                            .appliedDate(cursorApplication.getAppliedDate())
                            .applicationId(cursorApplication.getId())
                            .build()
            );
        }

        log.debug(
                "Returning application page: returned={}, hasMore={}",
                applications.size(),
                hasMore
        );

        // Build response
        return ApplicationPageResponse.builder()
                .content(applications.stream().map(ApplicationMapper::toApplicationResponse).toList())
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .build();

    }

    public List<StatusChangeResponse> getStatusHistory(Long applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new ApplicationNotFoundException(
                    "Could not find application with id: " + applicationId
            );
        }


        List<ApplicationStatusChange> statusChanges = statusChangeRepository.findByApplicationIdOrderByChangedAtDesc(applicationId);

        log.debug("Fetched {} applications", statusChanges.size());

        return statusChanges
                .stream()
                .map(StatusChangeMapper::toStatusChangeResponse)
                .toList();
    }


}
