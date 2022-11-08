package server

import (
	"github.com/felipepnascimento/challenge-bravo-flp/services"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"
)

type Services struct {
	ExchangeRateService services.ExchangeRateService
}

func SetupServices(httpClient utils.HTTPClient) *Services {
	exchangeRateService := services.InitializeExchangeRateService(httpClient)

	return &Services{
		ExchangeRateService: exchangeRateService,
	}
}
