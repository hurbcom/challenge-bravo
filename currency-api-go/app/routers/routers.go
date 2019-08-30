package routers

import (
	"net/http"
	"github.com/gorilla/mux"
	"github.com/challenge-bravo/currency-api-go/app/controller"
)


func SetRouters(router *mux.Router) *mux.Router {

	router.HandleFunc("/currencys", GetAllCurrencys).Methods("GET")
	router.HandleFunc("/currencys", CreateCurrency).Methods("POST")
	router.HandleFunc("/currencys/{id}", UpdateCurrency).Methods("PUT")
	router.HandleFunc("/currencys{id}", DeleteCurrency).Methods("DELETE")
	router.HandleFunc("/convert/", GetConvertion).Methods("GET")
	router.HandleFunc("/import_all/", Import_all).Methods("GET")

	return router
}

func GetAllCurrencys(w http.ResponseWriter, r *http.Request) {
	controller.GetAllCurrencys(w, r)
}

func CreateCurrency(w http.ResponseWriter, r *http.Request) {
	controller.CreateCurrency(w, r)
}

func GetCurrency(w http.ResponseWriter, r *http.Request) {
	controller.GetCurrency(w, r)
}

func UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	controller.UpdateCurrency(w, r)
}

func DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	controller.DeleteCurrency(w, r)
}

func GetConvertion(w http.ResponseWriter, r *http.Request){
	controller.GetConvertion(w, r)
}

func Import_all(w http.ResponseWriter, r *http.Request){
	controller.Import_all(w,r)
}