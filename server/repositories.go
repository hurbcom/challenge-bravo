package server

import (
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
	"github.com/jmoiron/sqlx"
)

type Repositories struct {
	CurrencyRepository repositories.CurrencyRepository
}

func SetupRepositories(db *sqlx.DB) *Repositories {
	currencyRepository := repositories.InitializeCurrencyRepository(db)

	return &Repositories{
		CurrencyRepository: currencyRepository,
	}
}
