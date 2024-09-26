package db_utils

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func WithTransaction[R any](c context.Context, dbConnection *pgxpool.Pool, fn func(pgx.Tx) R) (R, error) {
	var zeroValue R

	tx, err := dbConnection.Begin(c)
	if err != nil {
		return zeroValue, err
	}
	defer tx.Rollback(c)

	response := fn(tx)

	if err := tx.Commit(c); err != nil {
		return zeroValue, err
	}

	return response, nil
}

func TruncateAll(conn *pgxpool.Pool) {
	ctx := context.Background()
	rows, err := conn.Query(ctx, `
        SELECT table_name, table_schema
        FROM information_schema.tables
        WHERE table_schema IN('public') AND table_type = 'BASE TABLE'
    `)
	if err != nil {
		log.Fatalf("Failed to fetch table names: %v\n", err)
	}

	// Truncate each table
	for rows.Next() {
		var tableName string
		var tableSchema string
		if err := rows.Scan(&tableName, &tableSchema); err != nil {
			log.Fatalf("Failed to scan table name: %v\n", err)
		}

		var table string

		if tableSchema != "public" {
			table = fmt.Sprintf("%s.%s", tableSchema, tableName)
		} else {
			table = tableName
		}

		_, err := conn.Exec(ctx, fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY CASCADE", table))
		if err != nil {
			log.Fatalf("Failed to truncate table %s: %v\n", tableName, err)
		}
		// fmt.Printf("Truncated table: %s\n", tableName)
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error iterating rows: %v\n", err)
	}

	// fmt.Println("All tables truncated successfully.")
}
