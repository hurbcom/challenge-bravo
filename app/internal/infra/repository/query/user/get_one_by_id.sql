-- name: GetOneById :one
SELECT * FROM users WHERE id = $1;