package org.example.jobapplicationtracker.infrastructure.devtools;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.example.jobapplicationtracker.infrastructure.auth.repository.UserRepository;
import org.example.jobapplicationtracker.infrastructure.auth.security.JwtUtil;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
@RequestMapping("/dev")
@RequiredArgsConstructor
public class DevController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/login/{email}")
    public String loginAs(@PathVariable String email) {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("user not found"));
        return jwtUtil.generateToken(user.getEmail());
    }
}

