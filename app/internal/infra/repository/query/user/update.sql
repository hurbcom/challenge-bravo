-- name: Update :exec
UPDATE users
SET
    role = $2,
    email = $3,
    first_name = $4,
    last_name = $5,
    updated_at = $6,
    active = $7
WHERE
    id = $1;
