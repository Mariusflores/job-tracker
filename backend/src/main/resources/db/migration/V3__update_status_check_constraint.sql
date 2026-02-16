-- Fix applications
ALTER TABLE t_applications
DROP CONSTRAINT IF EXISTS t_applications_status_check;

ALTER TABLE t_applications
    ADD CONSTRAINT t_applications_status_check
        CHECK (status IN ('DRAFT','APPLIED','INTERVIEW','OFFER','REJECTED'));

-- Fix status change table
ALTER TABLE t_application_status_change
DROP CONSTRAINT IF EXISTS t_application_status_change_to_status_check;

ALTER TABLE t_application_status_change
    ADD CONSTRAINT t_application_status_change_to_status_check
        CHECK (to_status IN ('APPLIED','INTERVIEW','OFFER','REJECTED'));
