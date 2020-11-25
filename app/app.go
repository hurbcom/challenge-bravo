package app

import "github.com/ednailson/challenge-bravo/currency"

type App struct {
	currencyModule currency.Currency
}

func LoadApp() (*App, error) {
	currencyModule, err := currency.NewCurrency()
	if err != nil {
		return nil, err
	}
	return &App{currencyModule: currencyModule}, nil
}

func (a *App) Run() chan error {
	return nil
}

func (a *App) Close() {}
