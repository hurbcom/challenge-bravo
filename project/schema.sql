DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE
);

INSERT INTO currency (code) VALUES ('USD'), ('BRL'), ('EUR'), ('BTC'), ('ETH');
