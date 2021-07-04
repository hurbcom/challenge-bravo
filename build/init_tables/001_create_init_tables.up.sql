CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(3) NOT NULL,
    value decimal NOT NULL
);

INSERT INTO currencies (symbol, value) VALUES ('USD', 1);
INSERT INTO currencies (symbol, value) VALUES ('BRL', 0.2);
INSERT INTO currencies (symbol, value) VALUES ('BTC', 35484.50);
INSERT INTO currencies (symbol, value) VALUES ('ETH', 2357.01 );