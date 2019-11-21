package main

import (
	service "challenge-bravo/Service"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shopspring/decimal"
)

func main() {
	go func() {
		service.SetCurrency()
	}()

	router := mux.NewRouter()
	router.HandleFunc("/", Convert).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

// Convert converte a moeda enviada pela moeda pedida
func Convert(w http.ResponseWriter, r *http.Request) {
	from, to, amount, error := service.ValidPost(r)
	if error != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(error))
		return
	}

	result := service.GetValue(from, to, amount)

	if result.GreaterThan(decimal.NewFromFloat(0)) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Result: " + result.StringFixedCash(5)))

		return
	}

	w.WriteHeader(http.StatusInternalServerError)
	return
}
