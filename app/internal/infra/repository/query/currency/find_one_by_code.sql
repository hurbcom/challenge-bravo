-- name: FindOneByCode :one
SELECT * FROM currency WHERE code = $1;