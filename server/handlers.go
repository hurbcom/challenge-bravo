package server

import (
	handlers "github.com/felipepnascimento/challenge-bravo-flp/handlers"
)

type Handlers struct {
	CurrencyHandler   handlers.CurrencyHandler
	ConversionHandler handlers.ConversionHandler
}

func SetupHandlers(useCases *Usecases) *Handlers {
	currencyHandlers := handlers.InitializeCurrencyHandler(useCases.CurrencyUsecase)
	conversionHandlers := handlers.InitializeConversionHandler(useCases.ConversionUsecase)

	return &Handlers{
		CurrencyHandler:   currencyHandlers,
		ConversionHandler: conversionHandlers,
	}
}
