package routes

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type Route struct {
	URI      string
	Method   string
	Function func(http.ResponseWriter, *http.Request)
}

func Configure(router *mux.Router) *mux.Router {
	routes := searchCurrencyRoutes
	routes = append(routes, conversionRoutes...)
	routes = append(routes, syncRoutes...)

	for _, route := range routes {
		fmt.Println(route)
		router.HandleFunc(route.URI, route.Function).Methods(route.Method)
	}

	return router
}
