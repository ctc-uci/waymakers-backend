CREATE TABLE public.qualification_list
(
    id integer NOT NULL,
    volunteer_tier integer,
    create_timestamp timestamp without time zone,
    CONSTRAINT qualification_list_pkey PRIMARY KEY (id)
)
