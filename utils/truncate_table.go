package utils

import (
	"fmt"

	"github.com/felipepnascimento/challenge-bravo-flp/config"
	"gorm.io/gorm"
)

type TruncateTableExecutor struct {
	db *gorm.DB
}

func InitTruncateTableExecutor(db *gorm.DB) TruncateTableExecutor {
	return TruncateTableExecutor{
		db,
	}
}

func (executor *TruncateTableExecutor) TruncateTable(tableNames []string) {
	for _, name := range tableNames {
		query := fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY CASCADE;", name)

		if result := config.DB.Exec(query); result.Error != nil {
			panic(result.Error)
		}
	}
}
