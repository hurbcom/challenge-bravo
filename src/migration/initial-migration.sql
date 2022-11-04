CREATE TYPE quotation_type AS ENUM ('google_finance', 'custom');

CREATE TABLE currencies
(
  id serial PRIMARY KEY,
  key text,
  description text,
  enabled BOOL DEFAULT true,
  quotation_type quotation_type,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO currencies(key, description, quotation_type, created_at) VALUES
('USD', 'USD', 'google_finance', CURRENT_TIMESTAMP),
('BRL', 'BRL', 'google_finance', CURRENT_TIMESTAMP),
('EUR', 'EUR', 'google_finance', CURRENT_TIMESTAMP),
('BTC', 'BTC', 'google_finance', CURRENT_TIMESTAMP),
('ETH', 'ETH', 'google_finance', CURRENT_TIMESTAMP);
