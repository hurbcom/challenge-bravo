package router

import (
	"challenge-bravo/src/router/routes"

	"github.com/gorilla/mux"
)

func Generate() *mux.Router {
	router := mux.NewRouter()

	return routes.Configure(router)
}
