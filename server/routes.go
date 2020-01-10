package server

import (
	"challenge-bravo/server/handlers"
	"challenge-bravo/server/handlers/currency"
	"net/http"

	cors "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

//Run provides the routes to the application
func Run(port string) {
	r := mux.NewRouter()
	s := r.PathPrefix("/api").Subrouter()

	allowedHeaders := cors.AllowedHeaders([]string{
		"X-Requested-With",
		"Content-Type",
		"Accept",
		"Access-Control-Allow-Origin",
	})
	allowedOrigins := cors.AllowedOrigins([]string{"*"})
	allowedMethods := cors.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	// Testing endpoint
	s.HandleFunc("/ping", handlers.Ping).Methods("GET")

	// Currency Manipulation
	s.HandleFunc("/currency", currency.List).Methods("GET")
	s.HandleFunc("/currency", currency.Create).Methods("POST", "OPTIONS")
	s.HandleFunc("/currency/{id}", currency.Remove).Methods("DELETE")
	s.HandleFunc("/currency/code/{code}", currency.RemoveByCode).Methods("DELETE")

	//Exchange endpoint
	s.HandleFunc("/exchange", handlers.Exchange).Methods("GET")

	http.ListenAndServe(":"+port, cors.CORS(allowedHeaders, allowedOrigins, allowedMethods)(r))
}
