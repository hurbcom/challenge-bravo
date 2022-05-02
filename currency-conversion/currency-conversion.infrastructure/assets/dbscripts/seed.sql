
CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

CREATE TABLE IF NOT EXISTS Currency
(
	Code       	VARCHAR (10) COLLATE case_insensitive NOT NULL,
	Name       	VARCHAR(100)                          NOT NULL,
	Rate       	DOUBLE PRECISION,
	CreatedAt 	TIMESTAMP with TIME zone              NOT NULL DEFAULT NOW(),
	UpdatedAt 	TIMESTAMP with TIME zone 			  NOT NULL DEFAULT NOW(),
	CONSTRAINT currency_pkey 						  PRIMARY KEY (code)
);

CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON currency
FOR EACH ROW
EXECUTE PROCEDURE trigger_updated_at();