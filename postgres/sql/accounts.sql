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
    dayOfWeek INT NOT NULL,
    startTime TIME NOT NULL,
    PRIMARY KEY, (userid, dayOfWeek, startTime)
    FOREIGN KEY (userid) REFERENCES Users (userid) ON DELETE CASCADE
);