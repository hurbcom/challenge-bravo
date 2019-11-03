package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	log "github.com/sirupsen/logrus"

	"github.com/bispoman/challenge-bravo/models"
	"github.com/bispoman/challenge-bravo/service"
)

//Response on success cases
type Response struct {
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float64 `json:"amount"`
	Result float64 `json:"result"`
}

func Healthcheck(w http.ResponseWriter, r *http.Request) {
	log.Info("healthcheck hit, responding with ok")

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
		log.Warn("Empty query parameters or invalid amount")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid query parameters")
	}

	result := service.MathConvert(from[0], to[0], quant)
	responseObj := Response{from[0], to[0], quant, result}
	log.Info("Convertion sucessful, result: ", responseObj)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, fmt.Sprintf("%f", result))
}

func AddCurrency(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var newCurrency models.Currency
	err := decoder.Decode(&newCurrency)
	if err != nil {
		log.Info("Error decoding json, invalid json in the request body")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid Json")
	}

	success := service.SaveCurrency(newCurrency)
	if !success {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Unable to save sent currency")
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "New currency saved")
}
