-- V4__fix_action_type_enum.sql

ALTER TABLE t_idempotency_record
ALTER COLUMN action_type TYPE VARCHAR(50)
USING action_type::VARCHAR;