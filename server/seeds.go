package server

import (
	seeds "github.com/felipepnascimento/challenge-bravo-flp/migrations/seeds"
)

type Seeds struct {
	CurrencySeed seeds.CurrencySeed
}

func SetupSeeds(useCases *Usecases) *Seeds {
	currencySeeds := seeds.InitializeCurrencySeed(useCases.CurrencyUsecase)

	return &Seeds{
		CurrencySeed: currencySeeds,
	}
}
