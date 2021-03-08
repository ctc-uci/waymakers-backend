-- Trigger: user_changed_volunteer_tier

-- DROP TRIGGER user_changed_volunteer_tier ON public.users;

CREATE TRIGGER user_changed_volunteer_tier
    AFTER UPDATE OF tier
    ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_qualification_status();

CREATE TABLE Users
(
    userid CHAR(28) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    birthdate DATE NOT NULL,
    locationstreet VARCHAR(50) NOT NULL,
    locationcity VARCHAR(50) NOT NULL,
    locationstate CHAR(2) NOT NULL,
    locationzip INTEGER NOT NULL,
    tier INTEGER,
    PRIMARY KEY (userid)
);

-- FUNCTION: public.update_qualification_status()

-- DROP FUNCTION public.update_qualification_status();

CREATE FUNCTION public.update_qualification_status()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	DELETE from qualification_status where user_id = NEW.userid;
	INSERT INTO qualification_status(user_id, qualification_id)
	SELECT NEW.userid, id FROM qualification WHERE volunteer_tier = NEW.tier;
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.update_qualification_status()
    OWNER TO wmk_dev;

CREATE TABLE Permissions
(
    userid CHAR(28) NOT NULL,
    permissions ENUM('Volunteer', 'Staff', 'Admin') NOT NULL,
    FOREIGN KEY (userid) REFERENCES Users (userid) ON DELETE CASCADE
);

CREATE TABLE Availability
(
    userid CHAR(28) NOT NULL,
    dayofweek ENUM('M','T','W','TH','F','S','SU') NOT NULL,
    starttime TIME NOT NULL,
    endtime TIME NOT NULL,
    FOREIGN KEY (userid) REFERENCES Users (userid) ON DELETE CASCADE
);


CREATE TABLE qualification
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    qualification_name character varying COLLATE pg_catalog."default" NOT NULL,
    qualification_description character varying COLLATE pg_catalog."default",
    volunteer_tier integer,
    CONSTRAINT qualification_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.qualification
    OWNER to wmk_dev;

-- Trigger: qualification_added

-- DROP TRIGGER qualification_added ON public.qualification;

CREATE TRIGGER qualification_added
    AFTER INSERT
    ON public.qualification
    FOR EACH ROW
    EXECUTE PROCEDURE public.add_qualification_statues();

CREATE TABLE qualification_status
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id character(28) COLLATE pg_catalog."default" NOT NULL,
    completion_status boolean,
    completion_timestamp timestamp without time zone,
    qualification_id integer,
    notes character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT qualification_status_pkey PRIMARY KEY (id),
    CONSTRAINT qualification_id FOREIGN KEY (qualification_id)
        REFERENCES public.qualification (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

-- FUNCTION: public.add_qualification_statues()

-- DROP FUNCTION public.add_qualification_statues();

CREATE FUNCTION public.add_qualification_statues()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	INSERT INTO qualification_status(user_id, qualification_id)
	SELECT userid, NEW.id FROM users WHERE tier = NEW.volunteer_tier;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.add_qualification_statues()
    OWNER TO wmk_dev;
