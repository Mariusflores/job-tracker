package org.example.jobapplicationtracker.infrastructure.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.infrastructure.admin.dto.UserSummaryDto;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;
import org.example.jobapplicationtracker.infrastructure.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    private final UserRepository userRepository;

    @Transactional
    public void softDeleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setDeleted(true);
    }

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserSummaryDto::mapToUserSummaryDto)
                .toList();
    }
}
