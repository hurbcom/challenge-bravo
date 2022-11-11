package routes

import (
	"api/src/controllers"
	"net/http"
)

var currencyRoutes = []Route{
	{
		URI:      "/currencies/convert",
		Method:   http.MethodGet,
		Function: controllers.ConvertCurrency,
	},
	{
		URI:      "/currencies",
		Method:   http.MethodPost,
		Function: controllers.InsertCurrency,
	},
	{
		URI:      "/currencies/{name}",
		Method:   http.MethodDelete,
		Function: controllers.DeleteCurrency,
	},
	{
		URI:      "/currencies",
		Method:   http.MethodGet,
		Function: controllers.GetAllCurrencies,
	},
}
