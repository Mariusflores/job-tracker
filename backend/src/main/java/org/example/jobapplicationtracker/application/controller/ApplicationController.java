package org.example.jobapplicationtracker.application.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.application.dto.pagination.ApplicationPageResponse;
import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.request.ApplicationUpdateRequest;
import org.example.jobapplicationtracker.application.dto.request.UpdateNotesRequest;
import org.example.jobapplicationtracker.application.dto.request.UpdateStatusRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.service.ApplicationCommandService;
import org.example.jobapplicationtracker.application.service.ApplicationQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/application")
public class ApplicationController {

    private final ApplicationCommandService commandService;
    private final ApplicationQueryService queryService;

    // GET Requests

    @GetMapping
    public ApplicationPageResponse getApplicationsByCursor(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String cursor
    ) {
        return queryService.getNextApplicationsByCursor(limit, Optional.ofNullable(cursor));
    }

    @GetMapping("/{id}/status-history")
    public List<StatusChangeResponse> getStatusHistory(@PathVariable Long id) {
        return queryService.getStatusHistory(id);
    }

    // POST Requests

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse createApplication(
            @RequestBody ApplicationCreateRequest createRequest,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {

        String key = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();
        return commandService.createApplication(createRequest, key);
    }

    // PATCH Requests

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationUpdateRequest updateRequest,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        String key = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();
        return commandService.updateApplication(id, updateRequest, key);
    }

    @PatchMapping("{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest updateStatusRequest,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        String key = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();
        return commandService.updateApplicationStatus(id, updateStatusRequest.getApplicationStatus(), key);
    }

    @PatchMapping("/{id}/notes")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplicationNotes(
            @PathVariable long id,
            @RequestBody UpdateNotesRequest updateNotesRequest,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        String key = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();
        return commandService.updateApplicationNotes(id, updateNotesRequest.getNotes(), key);
    }

    // DELETE Requests
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteApplication(
            @PathVariable Long id,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        String key = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();
        commandService.deleteApplication(id, key);
    }
}
