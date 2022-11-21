package routes

import (
	"net/http"
)

type SearchController interface {
	GetAllCurrencies(http.ResponseWriter, *http.Request)
}

type SearchRoutes struct {
	controller SearchController
}

func NewSearchRoutes(controller SearchController) *SearchRoutes {
	return &SearchRoutes{controller}
}

var searchCurrencyRoutes = []Route{
	{
		URI:    "/currencies",
		Method: http.MethodGet,
	},
	{
		URI:    "/currencies/{name}",
		Method: http.MethodGet,
	},
}

func GenerateSearchCurrencyRoutes(controller SearchController) {
	newSearchRoutes := NewSearchRoutes(controller)

	searchCurrencyRoutes[0].Function = newSearchRoutes.controller.GetAllCurrencies
}
