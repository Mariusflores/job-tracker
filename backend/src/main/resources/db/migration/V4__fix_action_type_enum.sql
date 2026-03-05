-- V5__fix_action_type_enum.sql
ALTER TABLE t_idempotency_record
ALTER COLUMN action_type TYPE varchar(255);