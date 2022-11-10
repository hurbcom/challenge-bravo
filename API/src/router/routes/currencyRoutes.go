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
		URI:      "/currency",
		Method:   http.MethodPost,
		Function: controllers.InsertCurrency,
	},
	{
		URI:      "/currency/{name}",
		Method:   http.MethodDelete,
		Function: controllers.DeleteCurrency,
	},
}
