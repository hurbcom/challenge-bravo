package server

import usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"

type Usecases struct {
	CurrencyUsecase     usecases.CurrencyUsecase
	ConversionUsecase   usecases.ConversionUsecase
	ExchangeRateUsecase usecases.ExchangeRateUsecase
}

func SetupUsecases(repos *Repositories, services *Services) *Usecases {
	currencyUsecase := usecases.InitializeCurrencyUsecase(repos.CurrencyRepository)
	conversionUsecase := usecases.InitializeConversionUsecase(repos.ConversionRepository)
	exchangeRateUsecase := usecases.InitializeExchangeRateUsecase(services.ExchangeRateService)

	return &Usecases{
		CurrencyUsecase:     currencyUsecase,
		ConversionUsecase:   conversionUsecase,
		ExchangeRateUsecase: exchangeRateUsecase,
	}
}
