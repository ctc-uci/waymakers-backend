CREATE TABLE public.log_hours (
    log_id integer NOT NULL,
    userid character(28),
    event_id integer,
    log_start timestamp without time zone,
    log_end timestamp without time zone,
    total_hours numeric,
    additional_notes character varying(500),
    log_status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    rejected_notes character varying(500)
);