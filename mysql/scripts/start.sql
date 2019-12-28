USE conversion;
CREATE TABLE
IF NOT EXISTS currency
(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR
(50) NOT NULL,
  ballast_to_dollar DECIMAL
(10, 4) NOT NULL DEFAULT 0.0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = INNODB;

INSERT INTO currency
    (id, name, ballast_to_dollar)
VALUES
    (1, "USD", 1.0),
    (2, "BRL", 0),
    (3, "EUR", 0),
    (4, "BTC", 0),
    (5, "ETH", 0);