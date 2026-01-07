package org.example.jobapplicationtracker.application.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.application.dto.pagination.ApplicationPageResponse;
import org.example.jobapplicationtracker.application.dto.request.ApplicationCreateRequest;
import org.example.jobapplicationtracker.application.dto.request.ApplicationUpdateRequest;
import org.example.jobapplicationtracker.application.dto.request.UpdateNotesRequest;
import org.example.jobapplicationtracker.application.dto.request.UpdateStatusRequest;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;
import org.example.jobapplicationtracker.application.dto.response.StatusChangeResponse;
import org.example.jobapplicationtracker.application.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/application")
public class ApplicationController {

    private final ApplicationService service;

    // GET Requests

    @GetMapping
    public ApplicationPageResponse getApplicationsByCursor(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String cursor
    ) {
        return service.getNextApplicationsByCursor(limit, Optional.ofNullable(cursor));
    }

    @GetMapping("/{id}/status-history")
    public List<StatusChangeResponse> getStatusHistory(@PathVariable Long id) {
        return service.getStatusHistory(id);
    }

    // POST Requests

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse createApplication(@RequestBody ApplicationCreateRequest createRequest) {

        return service.createApplication(createRequest);
    }

    // PATCH Requests

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplication(@PathVariable Long id, @RequestBody ApplicationUpdateRequest updateRequest) {
        return service.updateApplication(id, updateRequest);
    }

    @PatchMapping("{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplicationStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest updateStatusRequest) {
        return service.updateApplicationStatus(id, updateStatusRequest.getApplicationStatus());
    }

    @PatchMapping("/{id}/notes")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse updateApplicationNotes(@PathVariable long id, @RequestBody UpdateNotesRequest updateNotesRequest) {
        return service.updateApplicationNotes(id, updateNotesRequest.getNotes());
    }

    // DELETE Requests
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }
}
