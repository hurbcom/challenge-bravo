package dao

import (
	"bytes"
	"context"
	_ "embed"
	"github.com/jackc/pgx/v4/pgxpool"
	"log"
	"text/template"
)

//go:embed assets/database.sql*
var dbInitScript string // dbInitScript database initialization script

// DB Database object
type DB struct {
	poll *pgxpool.Pool //poll Database connection pool, used to execute database queries
}

// Initialize database connection pool and run initialization script
func (db *DB) Initialize(connectionString string) error {

	// Parse connection string
	poolConfig, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		log.Println(err)
		return err
	}

	// Create database connection pool
	db.poll, err = pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		log.Println(err)
		return err
	}

	// Run initialization script from static assets from executable
	if err = db.runInitScript(dbInitScript); err != nil {
		db.Terminate()
		return err
	}

	return nil
}

// Terminate Close database connections
func (db *DB) Terminate() {
	db.poll.Close()
}

// runInitScript Read and parse initialization script template
func (db *DB) runInitScript(script string) error {

	// Create a new text template from script
	tmpl, err := template.New("sql").Parse(script)
	if err != nil {
		log.Println(err)
		return err
	}

	// Execute template replacing variables
	var buffer bytes.Buffer
	if err = tmpl.Execute(&buffer, struct {
		Version string
	}{
		Version: Version,
	}); err != nil {
		log.Println(err)
		return err
	}

	// Execute initialization script
	if _, err = db.poll.Exec(context.Background(), buffer.String()); err != nil {
		log.Println(err)
		return err
	}

	return nil
}
