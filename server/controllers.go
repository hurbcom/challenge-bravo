package server

import (
	controllers "github.com/felipepnascimento/challenge-bravo-flp/controllers"
)

type Controllers struct {
	CurrencyController   controllers.CurrencyController
	ConversionController controllers.ConversionController
}

func SetupControllers(useCases *Usecases) *Controllers {
	currencyControllers := controllers.InitializeCurrencyController(useCases.CurrencyUsecase)
	conversionControllers := controllers.InitializeConversionController(useCases.ConversionUsecase, useCases.CurrencyUsecase, useCases.ExchangeRateUsecase)

	return &Controllers{
		CurrencyController:   currencyControllers,
		ConversionController: conversionControllers,
	}
}
