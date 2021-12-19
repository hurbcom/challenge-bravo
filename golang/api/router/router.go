// Include routes in api
package router

import (
	"net/http"

	"github.com/gorilla/mux"
)

/* Create all endpoints available in routes */
func Serve() http.Handler {
	// Here we are instantiating the gorilla/mux router
	Router = mux.NewRouter()
	var handler http.Handler

	for _, route := range routes {
		handler = route.HandlerFunc

		Router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return Router
}
