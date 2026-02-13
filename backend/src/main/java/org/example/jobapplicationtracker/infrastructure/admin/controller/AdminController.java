package org.example.jobapplicationtracker.infrastructure.admin.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.infrastructure.admin.dto.UserSummaryDto;
import org.example.jobapplicationtracker.infrastructure.admin.service.AdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping
    public List<UserSummaryDto> getAllUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        adminService.softDeleteUser(id);
    }
}
