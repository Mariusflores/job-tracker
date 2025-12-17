package org.example.jobapplicationtracker.application.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.application.dto.ApplicationRequest;
import org.example.jobapplicationtracker.application.dto.ApplicationResponse;
import org.example.jobapplicationtracker.application.dto.UpdateNotesRequest;
import org.example.jobapplicationtracker.application.dto.UpdateStatusRequest;
import org.example.jobapplicationtracker.application.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/application")
public class ApplicationController {

    private final ApplicationService service;

    // GET Requests

    @GetMapping("/all")
    public List<ApplicationResponse> getAllApplications() {

        return service.getAllApplications();
    }

    // POST Requests

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse createApplication(@RequestBody ApplicationRequest request) {

        return service.createApplication(request);
    }

    // PUT Requests

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateApplication(@PathVariable Long id, @RequestBody ApplicationRequest applicationRequest) {
        service.updateApplication(id, applicationRequest);
    }

    @PatchMapping("{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public void updateApplicationStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        service.updateApplicationStatus(id, request.getApplicationStatus());
    }

    @PatchMapping("/{id}/notes")
    @ResponseStatus(HttpStatus.OK)
    public void updateApplicationNotes(@PathVariable long id, @RequestBody UpdateNotesRequest request) {
        service.updateApplicationNotes(id, request.getNotes());
    }

    // DELETE Requests
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }
}
