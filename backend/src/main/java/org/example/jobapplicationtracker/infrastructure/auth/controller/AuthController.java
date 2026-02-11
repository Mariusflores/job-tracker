package org.example.jobapplicationtracker.infrastructure.auth.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.auth.dto.LoginRequest;
import org.example.jobapplicationtracker.infrastructure.auth.dto.RegisterRequest;
import org.example.jobapplicationtracker.infrastructure.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String registerUser(@RequestBody RegisterRequest request) throws Exception {
        return authService.register(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public String login(@RequestBody LoginRequest request) throws Exception {
        return authService.login(request);
    }
}
