-- Create a new database
CREATE DATABASE IF NOT EXISTS currencydb;
USE currencydb;

-- Create a table for storing users
CREATE TABLE IF NOT EXISTS currencys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency VARCHAR(3) NOT NULL,
    ballast FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);