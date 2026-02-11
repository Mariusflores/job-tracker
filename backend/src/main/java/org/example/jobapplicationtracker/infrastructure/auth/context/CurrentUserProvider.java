package org.example.jobapplicationtracker.infrastructure.auth.context;

import org.example.jobapplicationtracker.infrastructure.auth.model.User;

public interface CurrentUserProvider {
    User getCurrentUser();
}
