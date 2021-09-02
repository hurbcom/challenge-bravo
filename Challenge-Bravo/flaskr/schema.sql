
DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    symbol TEXT PRIMARY KEY, 
    value_usd REAL
    );
INSERT INTO currency (symbol, value_usd) VALUES ('USD', 1);
INSERT INTO currency (symbol, value_usd) VALUES ('BRL', 0.19);
INSERT INTO currency (symbol, value_usd) VALUES ('EUR', 1.18);
INSERT INTO currency (symbol, value_usd) VALUES ('BTC', 47406.60);
INSERT INTO currency (symbol, value_usd) VALUES ('ETH', 3537.12);

