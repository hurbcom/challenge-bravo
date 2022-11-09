CREATE TABLE IF NOT EXISTS currencies
(
    id serial PRIMARY KEY,
    "key" VARCHAR(255) UNIQUE NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    exchange_api boolean DEFAULT true,
    custom_amount float DEFAULT 0,
    custom_currency VARCHAR(255) DEFAULT 0,
    created_at  timestamptz  NOT NULL DEFAULT Now()
);

CREATE TABLE IF NOT EXISTS conversions
(
    id serial PRIMARY KEY,
    "from" VARCHAR(128) NOT NULL,
    "to" VARCHAR(128) NOT NULL,
    amount float NOT NULL,
    result float NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT Now()
);