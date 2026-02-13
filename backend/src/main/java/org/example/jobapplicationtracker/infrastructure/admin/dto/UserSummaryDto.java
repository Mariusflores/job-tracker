package org.example.jobapplicationtracker.infrastructure.admin.dto;

import org.example.jobapplicationtracker.infrastructure.auth.model.Role;
import org.example.jobapplicationtracker.infrastructure.auth.model.User;

public record UserSummaryDto(
        Long id,
        String email,
        Role role,
        boolean deleted
) {
    public static UserSummaryDto mapToUserSummaryDto(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.isDeleted()
        );
    }

}

