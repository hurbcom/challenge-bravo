package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/alexruzenhack/challenge-bravo/exchange"
	"github.com/gorilla/mux"
)

func main() {

	r := mux.NewRouter()

	r.HandleFunc("/api/convert", convert).Methods("GET")
	r.HandleFunc("/", welcome).Methods("GET")

	log.Fatal(http.ListenAndServe("localhost:8000", r))
}

type exchage struct{}

func welcome(w http.ResponseWriter, req *http.Request) {
	// The "/" pattern matches everything, so we need to check
	// that we're at the root here.
	if req.URL.Path != "/" {
		http.NotFound(w, req)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Welcome to the home page!")
	return
}

func convert(w http.ResponseWriter, req *http.Request) {
	supportedCurrencies := []string{"USD", "EUR", "BRL", "BTC", "ETH"}

	from := strings.ToUpper(req.URL.Query().Get("from"))
	if from == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Query param \"from\" is required.")
		return
	}

	to := strings.ToUpper(req.URL.Query().Get("to"))
	if to == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Query param \"to\" is required.")
		return
	}

	amount := strings.ToUpper(req.URL.Query().Get("amount"))
	if amount == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Query param \"amount\" is required.")
		return
	}

	if !contains(supportedCurrencies, from) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Value %s for param \"from\" is not supported.", from)
		return
	}

	if !contains(supportedCurrencies, to) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Value %s for param \"to\" is not supported.", to)
		return
	}

	convertedFloat64, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid value %s for param \"amount\".", to)
		return
	}

	currencyExchange := exchange.NewExchange(from, to, convertedFloat64)

	order, err := currencyExchange.Process()
	if err != nil {
		w.WriteHeader(http.StatusBadGateway)
		fmt.Fprintf(w, "%d - Bad Gateway", http.StatusBadGateway)
		fmt.Println(err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	encodedOrder, _ := json.Marshal(order)
	io.WriteString(w, string(encodedOrder))
	return
}

func contains(arr []string, elm string) bool {
	for _, v := range arr {
		if v == elm {
			return true
		}
	}
	return false
}
