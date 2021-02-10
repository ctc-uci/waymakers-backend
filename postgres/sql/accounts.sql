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

CREATE TABLE qualification_list
(
    id integer NOT NULL,
    volunteer_tier integer,
    create_timestamp timestamp without time zone,
    CONSTRAINT qualification_list_pkey PRIMARY KEY (id)
);

CREATE TABLE qualification
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
);

CREATE TABLE qualification_status
(
    id integer NOT NULL,
    user_id character(28) COLLATE pg_catalog."default" NOT NULL,
    completion_status boolean,
    completion_timestamp timestamp without time zone,
    qualification_id integer,
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