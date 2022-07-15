package main

const defaultSchema = `
-- Create the standard enum
DO $$ BEGIN
	CREATE TYPE currency_standard AS ENUM ('FIAT', 'CRYPTO', 'FICTITIOUS');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Create the currency table
CREATE TABLE IF NOT EXISTS currency (
	code TEXT UNIQUE PRIMARY KEY,
	max_units INTEGER NOT NULL,
	thousands_splitter TEXT NOT NULL,
	decimal_splitter TEXT NOT NULL,
	fixed_exchange_rate_int_part BIGINT,
	fixed_exchange_rate_decimal_part BIGINT,
	standard currency_standard NOT NULL
);

-- Create the trigger to check if a FICTITIOUS currency is valid (i.e. it must contain the exchange rate fields)
CREATE OR REPLACE FUNCTION fictitious_procedure()
	RETURNS TRIGGER AS $fictitious_procedure$
BEGIN
	IF (NEW.standard='FICTITIOUS') AND (NEW.fixed_exchange_rate_int_part IS NULL OR NEW.fixed_exchange_rate_decimal_part IS NULL) THEN
		RAISE EXCEPTION 'Fixed exchange rates must be provided for fictitious currencies';
	END IF;
	RETURN NEW;
END;
$fictitious_procedure$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_fictitious BEFORE INSERT OR UPDATE ON currency
	FOR EACH ROW EXECUTE PROCEDURE fictitious_procedure();


-- Insert the default currencies into the database
INSERT INTO currency (code, max_units, thousands_splitter, decimal_splitter, standard)
VALUES('USD', 2, ',', '.', 'FIAT')
ON CONFLICT (code) DO NOTHING;

INSERT INTO currency (code, max_units, thousands_splitter, decimal_splitter, standard)
VALUES('BRL', 2, '.', ',', 'FIAT')
ON CONFLICT (code) DO NOTHING;

INSERT INTO currency (code, max_units, thousands_splitter, decimal_splitter, standard)
VALUES('EUR', 2, ',', '.', 'FIAT')
ON CONFLICT (code) DO NOTHING;

INSERT INTO currency (code, max_units, thousands_splitter, decimal_splitter, standard)
VALUES('BTC', 8, ',', '.', 'CRYPTO')
ON CONFLICT (code) DO NOTHING;

INSERT INTO currency (code, max_units, thousands_splitter, decimal_splitter, standard)
VALUES('ETH', 18, ',', '.', 'CRYPTO')
ON CONFLICT (code) DO NOTHING;
`
