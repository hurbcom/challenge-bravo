package routes

import (
	"api/src/controllers"
	"net/http"
)

var currencyRoutes = []Route{
	{
		URI:      "/currency/convert",
		Method:   http.MethodGet,
		Function: controllers.ConvertCurrency,
	},

	{
		URI:      "/currency/{name}",
		Method:   http.MethodGet,
		Function: controllers.GetCurrencyConversionRateFromDatabase,
	},
}
