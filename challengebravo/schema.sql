
DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    symbol TEXT PRIMARY KEY, 
    equivalent_to_usd REAL,
    keep_updated BOOLEAN
    );
INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES ('USD', 1, true);
INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES ('BRL', 0.19, true);
INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES ('EUR', 1.18, true);
INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES ('BTC', 47406.60, true);
INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES ('ETH', 3537.12, true);

