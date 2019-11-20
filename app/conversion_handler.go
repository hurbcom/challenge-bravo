package app

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gabrielerzinger/challenge-bravo/usecases"
)

// ConversionHandler struct, responsible for holding the app
type ConversionHandler struct {
	App          *App
	SourceServer usecases.CoinAPI
	Exchanger    *usecases.Exchanger
}

// NewConversionHandler instantiate a new conversion handler
func NewConversionHandler(a *App) *ConversionHandler {
	return &ConversionHandler{
		App:          a,
		SourceServer: usecases.NewExchangeRatesApi(),
		Exchanger:    usecases.NewExchanger(),
	}
}

// ServeHTTP handles http requests
func (ch *ConversionHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	queryParamMap := r.URL.Query()

	from := queryParamMap.Get("from")
	to := queryParamMap.Get("to")
	amount := queryParamMap.Get("amount")

	if from == "" || to == "" || amount == "" {
		ch.App.Logger.Info("Received a bad request, parameters missing")
		WriteError(w, http.StatusBadRequest, "all params are mandatory: from, to and amount", errors.New("Parameters missing"))
	}

	baseCoin, baseErr := ch.SourceServer.RetrieveCoinValue(from)
	targetCoin, targetError := ch.SourceServer.RetrieveCoinValue(to)
	floatAmount, strconvErr := strconv.ParseFloat(amount, 64)

	if baseErr != nil || targetError != nil || strconvErr != nil {
		WriteError(w, http.StatusInternalServerError, "failed to retrieve currency information", errors.New("Failed to retrieve currency values from API"))
	}

	fmt.Println(ch.Exchanger.Exchange(baseCoin, targetCoin, floatAmount))
}
