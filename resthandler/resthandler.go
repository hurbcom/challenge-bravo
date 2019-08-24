package resthandler

import (
	"github.com/julienschmidt/httprouter"
)

/*
New returns the currency converter REST API handler.
*/
func New() *httprouter.Router {
	router := httprouter.New()
	router.GET("/currencies", currenciesHandle)
	// TODO router.GET("/quotes/:currency", ...)
	// TODO router.GET("/conversion", ...)
	return router
}
