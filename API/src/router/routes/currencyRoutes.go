package routes

import (
	"net/http"
)

type CurrencyController interface {
	ConvertCurrency(http.ResponseWriter, *http.Request)
	InsertCurrency(http.ResponseWriter, *http.Request)
	DeleteCurrency(http.ResponseWriter, *http.Request)
	GetAllCurrencies(http.ResponseWriter, *http.Request)
}

type CurrencyRoutes struct {
	controller CurrencyController
}

func NewCurrencyRoutes(controller CurrencyController) *CurrencyRoutes {
	return &CurrencyRoutes{controller}
}

var currencyRoutes = []Route{
	{
		URI:    "/currencies/convert",
		Method: http.MethodGet,
	},
	{
		URI:    "/currencies",
		Method: http.MethodPost,
	},
	{
		URI:    "/currencies/{name}",
		Method: http.MethodDelete,
	},
	{
		URI:    "/currencies",
		Method: http.MethodGet,
	},
}

func GenerateRoutes(controller CurrencyController) {
	currencyRoutesObject := NewCurrencyRoutes(controller)

	currencyRoutes[0].Function = currencyRoutesObject.controller.ConvertCurrency
	currencyRoutes[1].Function = currencyRoutesObject.controller.InsertCurrency
	currencyRoutes[2].Function = currencyRoutesObject.controller.DeleteCurrency
	currencyRoutes[3].Function = currencyRoutesObject.controller.GetAllCurrencies

}
