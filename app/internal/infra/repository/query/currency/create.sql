-- name: Create :one
INSERT INTO currency
    (name, code, usd_exchange_rate, created_by, "number", country, country_code, search_url, response_path_to_rate, updated_by, fic)
VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)
RETURNING *;
