package resthandler

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func index(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	fmt.Fprintln(w, "hello, world")
}

/*
New returns the currency converter REST API handler.
*/
func New() *httprouter.Router {
	router := httprouter.New()
	router.GET("/", index)
	// TODO router.GET("/currencies", ...)
	// TODO router.GET("/quotes/:currency", ...)
	// TODO router.GET("/conversion", ...)
	return router
}
