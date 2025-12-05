package org.example.jobapplicationtracker.application.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.application.dto.ApplicationRequest;
import org.example.jobapplicationtracker.application.dto.ApplicationResponse;
import org.example.jobapplicationtracker.application.model.ApplicationStatus;
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
    public void createApplication(@RequestBody ApplicationRequest request) {

        service.createApplication(request);
    }

    // PUT Requests

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateApplication(@PathVariable Long id, @RequestBody ApplicationStatus statusUpdate) {
        service.updateApplication(id, statusUpdate);
    }

    // DELETE Requests
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }
}
