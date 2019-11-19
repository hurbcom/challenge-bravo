package main

import (
	service "challenge-bravo/Service"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
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
		w.Write([]byte("Please, fill the " + strings.ToUpper(error) + " field"))
		return
	}

	result := service.GetValue(from, to, amount)

	if result > 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Result: " + fmt.Sprintf("%f", result)))
		return
	}

	w.WriteHeader(http.StatusInternalServerError)
	return
}
