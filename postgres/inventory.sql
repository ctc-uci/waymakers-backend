CREATE DATABASE inventory_database;

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    in_stock INTEGER,
    number_needed INTEGER,
    category varchar(255)
);