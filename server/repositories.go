package server

import (
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
	"github.com/jmoiron/sqlx"
)

type Repositories struct {
	CurrencyRepository   repositories.CurrencyRepository
	ConversionRepository repositories.ConversionRepository
}

func SetupRepositories(db *sqlx.DB) *Repositories {
	currencyRepository := repositories.InitializeCurrencyRepository(db)
	conversionRepository := repositories.InitializeConversionRepository(db)

	return &Repositories{
		CurrencyRepository:   currencyRepository,
		ConversionRepository: conversionRepository,
	}
}
