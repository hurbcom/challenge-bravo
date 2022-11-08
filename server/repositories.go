package server

import (
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
	"gorm.io/gorm"
)

type Repositories struct {
	CurrencyRepository   repositories.CurrencyRepository
	ConversionRepository repositories.ConversionRepository
}

func SetupRepositories(db *gorm.DB) *Repositories {
	currencyRepository := repositories.InitializeCurrencyRepository(db)
	conversionRepository := repositories.InitializeConversionRepository(db)

	return &Repositories{
		CurrencyRepository:   currencyRepository,
		ConversionRepository: conversionRepository,
	}
}
