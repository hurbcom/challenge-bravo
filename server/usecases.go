package server

import usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"

type Usecases struct {
	CurrencyUsecase usecases.CurrencyUsecase
}

func SetupUsecases(repos *Repositories) *Usecases {
	currencyUsecase := usecases.InitializeCurrencyUsecase(repos.CurrencyRepository)

	return &Usecases{
		CurrencyUsecase: currencyUsecase,
	}
}
