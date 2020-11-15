CREATE DATABASE accounts_database;

CREATE TABLE accounts(
    account_id SERIAL PRIMARY KEY,
    username varchar(255),
    password varchar(255)
);