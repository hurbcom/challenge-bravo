package server

import usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"

type Usecases struct {
	CurrencyUsecase   usecases.CurrencyUsecase
	ConversionUsecase usecases.ConversionUsecase
}

func SetupUsecases(repos *Repositories) *Usecases {
	currencyUsecase := usecases.InitializeCurrencyUsecase(repos.CurrencyRepository)
	conversionUsecase := usecases.InitializeConversionUsecase(repos.ConversionRepository)

	return &Usecases{
		CurrencyUsecase:   currencyUsecase,
		ConversionUsecase: conversionUsecase,
	}
}
