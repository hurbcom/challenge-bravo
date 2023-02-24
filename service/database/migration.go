package database

import (
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func DBMigrationRun(dbURL, sourceMigrationURL string) error {
	migration, err := migrate.New(sourceMigrationURL, dbURL)

	if err != nil {
		return err
	}

	err = migration.Up()

	if err != migrate.ErrNoChange {
		return err
	}

	return nil
}
