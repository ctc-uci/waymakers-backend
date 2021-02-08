CREATE TABLE public.qualification
(
    id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    question character varying COLLATE pg_catalog."default",
    qualification_list_id integer,
    CONSTRAINT qualification_pkey PRIMARY KEY (id),
    CONSTRAINT qualification_list_id FOREIGN KEY (qualification_list_id)
        REFERENCES public.qualification_list (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)