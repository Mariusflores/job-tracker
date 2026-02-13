package org.example.jobapplicationtracker.infrastructure.devtools;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.auth.model.Role;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.example.jobapplicationtracker.infrastructure.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Profile("dev")
@Component
@RequiredArgsConstructor
public class DevDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmailAndDeletedFalse("admin@test.com")) {
            userRepository.save(
                    User.builder()
                            .email("admin@test.com")
                            .password(passwordEncoder.encode("password"))
                            .role(Role.ADMIN)
                            .deleted(false)
                            .build()
            );
        }
    }
}

