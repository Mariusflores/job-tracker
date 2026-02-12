package org.example.jobapplicationtracker.infrastructure.auth.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.auth.dto.AuthResponse;
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
    public AuthResponse registerUser(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
