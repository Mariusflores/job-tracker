ALTER TABLE t_applications
DROP CONSTRAINT t_applications_status_check;

ALTER TABLE t_applications
    ADD CONSTRAINT t_applications_status_check
        CHECK (status IN ('DRAFT', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'));
