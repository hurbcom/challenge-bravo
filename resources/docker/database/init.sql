CREATE DATABASE CurrencyExchange;

CREATE TABLE Currencies (
    Id VARCHAR(3) PRIMARY KEY,
    UsdRate FLOAT,
    RateDate DATE
);