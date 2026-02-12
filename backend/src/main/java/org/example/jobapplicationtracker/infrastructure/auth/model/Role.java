package org.example.jobapplicationtracker.infrastructure.auth.model;

public enum Role {
    USER, ADMIN;

    public String getAuthority() {
        return "ROLE_" + name();
    }
}
