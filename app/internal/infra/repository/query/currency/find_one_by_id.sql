-- name: FindOneById :one
SELECT * FROM currency WHERE id = $1;