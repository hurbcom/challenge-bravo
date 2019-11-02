package controller

import (
	"fmt"
	"net/http"
	"strconv"
)

//Response on success cases
type Response struct {
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float64 `json:"amount"`
	Result float64 `json:"result"`
}

func Healthcheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("healthcheck hit, responding with ok")

	w.WriteHeader(http.StatusOK)

	fmt.Fprintf(w, "Ok")
}

func Convert(w http.ResponseWriter, r *http.Request) {
	queryparams := r.URL.Query()
	from := queryparams["from"]
	to := queryparams["to"]
	amount := queryparams["amount"]
	quant, err := strconv.ParseFloat(amount[0], 64)

	if from[0] == "" || to[0] == "" || err != nil {
		fmt.Println("Empty query parameters or invalid amount")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid query parameters")
	}

}
