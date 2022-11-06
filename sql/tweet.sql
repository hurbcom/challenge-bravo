CREATE TABLE IF NOT EXISTS tweets
(
    id          serial PRIMARY KEY,
    username    VARCHAR(128) NOT NULL,
    "text"      TEXT         NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT Now(),
    modified_at timestamptz  NOT NULL DEFAULT Now()
)