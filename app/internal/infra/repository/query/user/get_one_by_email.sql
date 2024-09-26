-- name: GetOneByEmail :one
SELECT * FROM users WHERE email = $1;