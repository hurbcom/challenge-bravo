package utils

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type TruncateTableExecutor struct {
	db *sqlx.DB
}

func InitTruncateTableExecutor(db *sqlx.DB) TruncateTableExecutor {
	return TruncateTableExecutor{
		db,
	}
}

func (executor *TruncateTableExecutor) TruncateTable(tableNames []string) {
	var err error

	tx, err := executor.db.Beginx()
	if err != nil {
		panic(err)
	} else {
		for _, name := range tableNames {
			query := fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY CASCADE;", name)
			_, err := tx.Exec(query)
			if err != nil {
				panic(err)
			}
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
		panic(err)
	}
}
