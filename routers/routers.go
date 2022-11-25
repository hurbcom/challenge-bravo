package routers

import (
	"net/http"

	"github.com/Ricardo-Sales/challenge-bravo/controllers"
	"github.com/gorilla/mux"
)

func Generate() *mux.Router {

	router := mux.NewRouter()
	router.HandleFunc("/currency", controllers.GetAllCurrency).Methods(http.MethodGet)
	router.HandleFunc("/currency", controllers.PostCurrency).Methods(http.MethodPost)
	router.HandleFunc("/currency/{id}", controllers.GetOneCurrency).Methods(http.MethodGet)
	router.HandleFunc("/currency/{id}", controllers.PutCurrency).Methods(http.MethodPut)
	router.HandleFunc("/currency/{id}", controllers.DeleteCurrency).Methods(http.MethodDelete)

	return router
}
