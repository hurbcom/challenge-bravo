CREATE TABLE currency (
	id SERIAL PRIMARY KEY,
	code VARCHAR(10) NOT NULL UNIQUE
);

INSERT INTO currency (code) VALUES
('USD'),
('BRL'),
('EUR'),
('BTC'),
('ETH');

CREATE TABLE currency_quote (
	currency_id INT NOT NULL,
	quote_value DECIMAL NOT NULL,
	CONSTRAINT fk_currency_id FOREIGN KEY (currency_id) REFERENCES currency(id)
);

CREATE TABLE backing_currency (
	currency_id INT NOT NULL,
	CONSTRAINT fk_currency_id FOREIGN KEY (currency_id) REFERENCES currency(id)
);

INSERT INTO backing_currency (currency_id) VALUES
((SELECT id FROM currency WHERE code = 'USD'));