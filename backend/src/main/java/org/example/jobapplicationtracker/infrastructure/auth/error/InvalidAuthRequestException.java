package org.example.jobapplicationtracker.infrastructure.auth.error;

public class InvalidAuthRequestException extends RuntimeException {
    public InvalidAuthRequestException(String message) {
        super(message);
    }
}
