package route

import (
	"github.com/bispoman/challenge-bravo/controller"
	"github.com/gorilla/mux"
)

func GetRoutes() *mux.Router {

	routes := mux.NewRouter().StrictSlash(false)

	routes = routes.PathPrefix("/api/v1").Subrouter()

	routes.HandleFunc("/healthcheck", controller.Healthcheck).Methods("GET")

	routes.HandleFunc("/convert", controller.Convert).Methods("GET")

	routes.HandleFunc("/add", controller.AddCurrency).Methods("POST")

	routes.HandleFunc("/delete", controller.DeleteCurrency).Methods("DELETE")

	return routes
}
