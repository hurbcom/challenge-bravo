package routes

import (
	"challenge-bravo/src/controllers"
	"challenge-bravo/src/models"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateCurrencyRoutes(router *mux.Router, currencyController *controllers.CurrencyController) {
	routes := []models.Route{
		{
			URL:    "/currency",
			Func:   currencyController.Create,
			Method: http.MethodPost,
			IsAuth: false,
		},
		{
			URL:    "/currency/{code}",
			Func:   currencyController.Find,
			Method: http.MethodGet,
			IsAuth: false,
		},
		{
			URL:    "/currency/{code}",
			Func:   currencyController.Delete,
			Method: http.MethodDelete,
			IsAuth: false,
		},
		{
			URL:    "/convert",
			Func:   currencyController.Convert,
			Method: http.MethodGet,
			IsAuth: false,
		},
	}

	for _, route := range routes {
		router.HandleFunc(route.URL, route.Func).Methods(route.Method)
	}
}
