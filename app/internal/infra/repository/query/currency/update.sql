-- name: Update :exec
UPDATE
    currency
SET
    name = $2,
    code = $3,
    number = $4,
    country = $5,
    country_code = $6,
    search_url = $7,
    response_path_to_rate = $8,
    usd_exchange_rate = $9,
    fic = $10,
    updated_by = $11,
    updated_at = $12
WHERE
    id = $1;