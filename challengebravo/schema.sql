
DROP TABLE IF EXISTS currency;

CREATE TABLE currency (
    symbol TEXT PRIMARY KEY, 
    usd_value REAL,
    keep_updated BOOLEAN
    );
INSERT INTO currency (symbol, usd_value, keep_updated) VALUES ('USD', 1, true);
INSERT INTO currency (symbol, usd_value, keep_updated) VALUES ('BRL', 5.1827, true);
INSERT INTO currency (symbol, usd_value, keep_updated) VALUES ('EUR', 0.841472, true);
INSERT INTO currency (symbol, usd_value, keep_updated) VALUES ('BTC', 0.000020553795, true);
INSERT INTO currency (symbol, usd_value, keep_updated) VALUES ('ETH', 0.000266456698, true);

