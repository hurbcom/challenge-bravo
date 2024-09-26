-- name: Create :one
INSERT INTO users
    (role, email, first_name, last_name, password)
VALUES
    ($1,$2,$3,$4, $5)
RETURNING *;