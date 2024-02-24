-- Create a new database
CREATE DATABASE IF NOT EXISTS currencydb;
USE currencydb;

-- Create a table for storing users
CREATE TABLE IF NOT EXISTS currencys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency VARCHAR(10) NOT NULL,
    ballast_usd FLOAT NOT NULL,
    crypto BOOLEAN NOT NULL DEFAULT 0,
    imported BOOLEAN NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);