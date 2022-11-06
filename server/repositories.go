package server

import (
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
	"gorm.io/gorm"
)

type Repositories struct {
	CurrencyRepository repositories.CurrencyRepository
}

func SetupRepositories(db *gorm.DB) *Repositories {
	currencyRepository := repositories.InitializeCurrencyRepository(db)

	return &Repositories{
		CurrencyRepository: currencyRepository,
	}
}
