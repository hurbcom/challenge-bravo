package routes

import (
	"net/http"
)

type CurrencyController interface {
	GetAllCurrencies(http.ResponseWriter, *http.Request)
}

type CurrencyRoutes struct {
	controller CurrencyController
}

func NewCurrencyRoutes(controller CurrencyController) *CurrencyRoutes {
	return &CurrencyRoutes{controller}
}

var searchCurrencyRoutes = []Route{
	{
		URI:    "/currencies",
		Method: http.MethodGet,
	},
}

func GenerateSearchCurrencyRoutes(controller CurrencyController) {
	newCurrencyRoutes := NewCurrencyRoutes(controller)

	searchCurrencyRoutes[0].Function = newCurrencyRoutes.controller.GetAllCurrencies
}
