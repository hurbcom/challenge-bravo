DO
$$
    DECLARE
        version CHARACTER VARYING;
    BEGIN

        -- Check schema version
        IF EXISTS(SELECT
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    and table_name = 'config') THEN
            SELECT value INTO version FROM config WHERE key = 'version';
            IF version <> '{{.Version}}' OR version IS NULL THEN
                RAISE EXCEPTION 'invalid schema version: provided(%) expected ({{.Version}})',version;
            ELSE
                RAISE INFO 'database schema at the current version';
                RETURN;
            END IF;
        END IF;

        -- Create a custom collation that are case insensitive and ignore accents
        CREATE COLLATION IF NOT EXISTS ignore_case_accents
            (PROVIDER = icu, LC_COLLATE = 'und-u-ks-level1', LC_CTYPE = 'und-u-ks-level1');

        COMMENT ON COLLATION ignore_case_accents
            IS 'Case insensitive and accents ignored collation';

        -- Create currency type data type
        IF NOT EXISTS(SELECT FROM pg_type WHERE typname = 'currency_type') THEN
            CREATE TYPE currency_type AS ENUM ('C', 'Y', 'U');
            COMMENT ON TYPE currency_type
                IS
                    'Currencies types
                    - C : Currency
                    - Y : Crypto
                    - U : Custom currency';
        END IF;

        -- create trigger function to set update_at row
        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
            RETURNS trigger
            LANGUAGE 'plpgsql'
            COST 100
            VOLATILE LEAKPROOF
        AS
        $BODY$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $BODY$;

        COMMENT ON FUNCTION trigger_set_timestamp()
            IS 'Trigger function that sets update_at column';

        -- Create currency table
        CREATE TABLE IF NOT EXISTS currency
        (
            code       character varying(10) COLLATE ignore_case_accents NOT NULL,
            type       currency_type                                     NOT NULL,
            name       character varying(100)                            NOT NULL,
            rate       numeric(12, 4),
            created_at timestamp with time zone                          NOT NULL DEFAULT now(),
            updated_at timestamp with time zone                          NOT NULL DEFAULT now(),
            CONSTRAINT currency_pkey PRIMARY KEY (code)
        );

        COMMENT ON COLUMN currency.code IS 'Currency code';
        COMMENT ON COLUMN currency.type IS 'Currency type';
        COMMENT ON COLUMN currency.name IS 'Currency name';
        COMMENT ON COLUMN currency.rate IS 'Custom currency USD rate';
        COMMENT ON COLUMN currency.created_at IS 'Creation timestamp';
        COMMENT ON COLUMN currency.updated_at IS 'Update timestamp';

        CREATE TRIGGER currency_trigger
            BEFORE UPDATE
            ON currency
            FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

        COMMENT ON TRIGGER currency_trigger ON currency IS 'Set update_at column on row update';

        -- Create config table
        CREATE TABLE IF NOT EXISTS config
        (
            key        character varying(50) COLLATE public.ignore_case_accents NOT NULL,
            value      character varying(50)                                    NOT NULL,
            created_at timestamp with time zone                                 NOT NULL DEFAULT now(),
            updated_at timestamp with time zone                                 NOT NULL DEFAULT now(),
            CONSTRAINT config_pkey PRIMARY KEY (key)
        );

        CREATE TRIGGER config_trigger
            BEFORE UPDATE
            ON config
            FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

        INSERT INTO config(key, value) VALUES ('version', '{{.Version}}');
    END
$$;