// Package database provides a helper utitlity func to start a sqlx connection.
package database

import (
	"fmt"

	"github.com/Pedro-Pessoa/challenge-bravo/cmd/env"
	"github.com/jmoiron/sqlx"
)

// Init connects to a postgres database using sqlx and the provided env.Data.
// It also executes all queries in mustExecQueries.
// Usually this queries are used to set the database up.
// They are opitional. Passing nil will not cause a panic.
func Init(data env.Data, mustExecQueries []string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", data.PQHost, data.PQUser, data.PQDB, data.PQPass))
	if err != nil {
		return nil, err
	}

	for _, query := range mustExecQueries {
		_, err = db.Exec(query)
		if err != nil {
			return nil, err
		}
	}

	return db, nil
}
