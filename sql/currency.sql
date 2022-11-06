CREATE TABLE IF NOT EXISTS currencies
(
    id          serial PRIMARY KEY,
    key    VARCHAR(128) NOT NULL,
    description      VARCHAR(256)         NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT Now(),
    updated_at timestamptz  NOT NULL DEFAULT Now()
)