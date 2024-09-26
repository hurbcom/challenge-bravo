CREATE TABLE IF NOT EXISTS currency (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    code VARCHAR(5) UNIQUE NOT NULL,
    number INT,
    usd_exchange_rate DECIMAL(10, 2) NOT NULL,
    search_url TEXT,
    response_path_to_rate TEXT,
    country VARCHAR(100),
    country_code VARCHAR(3),
    fic BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INT NOT NULL REFERENCES users(id),
    updated_by INT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON currency(code);