package app

import (
	"log"
	"net/http"

	"github.com/EltonARodrigues/currency-api-go/app/routers"

	"github.com/gorilla/mux"
)

var Router *mux.Router

func Initialize() {
	
	Router = routers.SetRouters()
}

func Run(host string) {
	log.Fatal(http.ListenAndServe(host, Router))
}
