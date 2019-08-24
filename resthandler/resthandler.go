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
	router.GET("/quotes/:currency", quotesHandle)
	router.GET("/conversion", conversionHandle)
	return router
}
