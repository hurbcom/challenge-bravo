package server

import (
	handlers "github.com/felipepnascimento/challenge-bravo-flp/handlers"
)

type Handlers struct {
	CurrencyHandler   handlers.CurrencyHandler
	ConversionHandler handlers.ConversionHandler
}

func SetupHandlers(useCases *Usecases, services *Services) *Handlers {
	currencyHandlers := handlers.InitializeCurrencyHandler(useCases.CurrencyUsecase)
	conversionHandlers := handlers.InitializeConversionHandler(useCases.ConversionUsecase, useCases.CurrencyUsecase, services.ExchangeRateService)

	return &Handlers{
		CurrencyHandler:   currencyHandlers,
		ConversionHandler: conversionHandlers,
	}
}
