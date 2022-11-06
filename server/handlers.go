package server

import (
	handlers "github.com/felipepnascimento/challenge-bravo-flp/handlers"
)

type Handlers struct {
	CurrencyHandler handlers.CurrencyHandler
}

func SetupHandlers(useCases *Usecases) *Handlers {
	currencyHandlers := handlers.InitializeCurrencyHandler(useCases.CurrencyUsecase)

	return &Handlers{
		CurrencyHandler: currencyHandlers,
	}
}
