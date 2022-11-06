package server

import (
	handlers "github.com/felipepnascimento/challenge-bravo-flp/handlers"
)

type Handlers struct {
	CurrencyHandler handlers.CurrencyHandler
}

func SetupHandlers(uscs *Usecases) *Handlers {
	currencyHandlers := handlers.InitializeCurrencyHandler(uscs.CurrencyUsecase)

	return &Handlers{
		CurrencyHandler: currencyHandlers,
	}
}
