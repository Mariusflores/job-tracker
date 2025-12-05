package org.example.jobapplicationtracker.application.error;

public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(String msg) {
        super(msg);
    }
}
