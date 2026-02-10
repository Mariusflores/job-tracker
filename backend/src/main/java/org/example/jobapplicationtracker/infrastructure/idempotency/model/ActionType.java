package org.example.jobapplicationtracker.infrastructure.idempotency.model;

public enum ActionType {
    CREATE_APPLICATION,
    UPDATE_APPLICATION,
    CHANGE_APPLICATION_STATUS,
    CHANGE_APPLICATION_NOTES,
    DELETE_APPLICATION,
    ENRICH_APPLICATION

}
