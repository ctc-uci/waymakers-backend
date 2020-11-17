CREATE DATABASE inventory_database;

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    quantity INTEGER,
    needed INTEGER,
    category varchar(255)
);