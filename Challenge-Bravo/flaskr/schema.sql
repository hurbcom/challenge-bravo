
DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    symbol TEXT PRIMARY KEY, 
    usd_value REAL
    );
INSERT INTO currency (symbol, usd_value) VALUES ('USD', 1);
INSERT INTO currency (symbol, usd_value) VALUES ('BRL', 0.19);
INSERT INTO currency (symbol, usd_value) VALUES ('EUR', 1.18);
INSERT INTO currency (symbol, usd_value) VALUES ('BTC', 47406.60);
INSERT INTO currency (symbol, usd_value) VALUES ('ETH', 3537.12);

