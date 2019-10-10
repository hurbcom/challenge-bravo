DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO currency (name) VALUES ('USD'), ('BRL'), ('EUR'), ('BTC'), ('ETH');
