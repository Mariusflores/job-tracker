package org.example.jobapplicationtracker.infrastructure.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.infrastructure.auth.dto.AuthResponse;
import org.example.jobapplicationtracker.infrastructure.auth.dto.LoginRequest;
import org.example.jobapplicationtracker.infrastructure.auth.dto.RegisterRequest;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.example.jobapplicationtracker.infrastructure.auth.repository.UserRepository;
import org.example.jobapplicationtracker.infrastructure.auth.security.JwtUtil;
import org.example.jobapplicationtracker.infrastructure.auth.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Register request for: {}", registerRequest.getEmail());

        if (registerRequest.getEmail() == null || registerRequest.getPassword() == null) {
            throw new IllegalArgumentException("Email or password is null");
        }

        String hashedPassword = hashPassword(registerRequest.getPassword());

        if (!userExists(registerRequest.getEmail())) {
            User user = User.builder()
                    .email(registerRequest.getEmail())
                    .password(hashedPassword)
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .build();

            log.info("Registering..");
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User already exists");
        }
        return AuthResponse.builder()
                .token(jwtUtil.generateToken(registerRequest.getEmail()))
                .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        UserDetails userDetails = userDetailsService.loadUserByEmail(loginRequest.getEmail());

        if (authenticate(loginRequest.getPassword(), userDetails.getPassword())) {
            return AuthResponse.builder()
                    .token(jwtUtil.generateToken(loginRequest.getEmail()))
                    .build();
        } else {
            throw new BadCredentialsException("Incorrect email or password");
        }
    }

    private boolean authenticate(String rawPassword, String storedHash) {
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    private boolean userExists(String email) {
        return userRepository.existsByEmailAndDeletedFalse(email);
    }

    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }


}
