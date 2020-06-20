CREATE DATABASE IF NOT EXISTS currencies;

USE currencies;

CREATE TABLE currencies.currencies (
	id INT auto_increment NOT NULL,
	description varchar(100) NOT NULL,
	isoCode varchar(3) NOT NULL,
	CONSTRAINT currencies_PK PRIMARY KEY (id),
	CONSTRAINT currencies_UN UNIQUE KEY (isoCode)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
AUTO_INCREMENT=1;

INSERT INTO currencies.currencies (description, isoCode)
VALUES
('Dollar Americano', 'USD'),
('Real Brasileiro', 'BRL'),
('Euro', 'EUR'),
('Bitcoin', 'BTC'),
('Ethereum', 'ETH');