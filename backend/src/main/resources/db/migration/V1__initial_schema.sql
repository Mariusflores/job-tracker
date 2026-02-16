-- =========================
-- USERS
-- =========================
CREATE TABLE t_users
(
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255),
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    role       VARCHAR(50)  NOT NULL,
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Optional index for login lookups (you query by email + deleted)
CREATE INDEX idx_users_email_deleted
    ON t_users (email, deleted);


-- =========================
-- APPLICATIONS
-- =========================
CREATE TABLE t_applications
(
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    job_title       VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255) NOT NULL,
    description_url VARCHAR(1000),
    status          VARCHAR(50)  NOT NULL,
    applied_date    DATE         NOT NULL,
    notes           TEXT,

    CONSTRAINT fk_application_user
        FOREIGN KEY (user_id)
            REFERENCES t_users (id)
            ON DELETE CASCADE
);

-- Enum constraint
ALTER TABLE t_applications
    ADD CONSTRAINT t_applications_status_check
        CHECK (status IN ('DRAFT', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'));

CREATE INDEX idx_applications_user_id
    ON t_applications (user_id);


-- =========================
-- APPLICATION STATUS HISTORY
-- =========================
CREATE TABLE t_application_status_change
(
    id             BIGSERIAL PRIMARY KEY,
    application_id BIGINT      NOT NULL,
    from_status    VARCHAR(50),
    to_status      VARCHAR(50) NOT NULL,
    changed_at     TIMESTAMP   NOT NULL,

    CONSTRAINT fk_status_change_application
        FOREIGN KEY (application_id)
            REFERENCES t_applications (id)
            ON DELETE CASCADE
);

-- Only real lifecycle states allowed (no DRAFT history)
ALTER TABLE t_application_status_change
    ADD CONSTRAINT t_application_status_change_to_status_check
        CHECK (to_status IN ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'));

CREATE INDEX idx_status_change_application
    ON t_application_status_change (application_id);


-- =========================
-- IDEMPOTENCY
-- =========================
CREATE TABLE t_idempotency_record
(
    id                BIGSERIAL PRIMARY KEY,
    idempotency_key   VARCHAR(255) NOT NULL UNIQUE,
    user_id           BIGINT,
    action_type       VARCHAR(50),
    target_id         BIGINT,
    payload_hash      VARCHAR(255) NOT NULL,
    response_snapshot TEXT,
    created_date      TIMESTAMP    NOT NULL,
    expires_at        TIMESTAMP
);

CREATE INDEX idx_idempotency_user
    ON t_idempotency_record (user_id);
