package controllers

import (
	"challenge-bravo/src/models"
	"challenge-bravo/src/responses"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

type SyncService interface {
	UpdateAllUpdatableCurrencies()
	UpdateCurrency(models.Currency) error
	InsertCurrency(models.Currency) error
	DeleteCurrency(string) error
}

type SyncCurrencyController struct {
	service SyncService
}

func NewSyncCurrencyController(service SyncService) *SyncCurrencyController {
	return &SyncCurrencyController{service}
}

func (syncCurrencyController SyncCurrencyController) UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")
	syncCurrencyController.service.UpdateAllUpdatableCurrencies()
}

func (syncCurrencyController SyncCurrencyController) InsertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	requestBody, err := io.ReadAll(request.Body)
	if err != nil {
		fmt.Println("error trying to read from request body: ", err)
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	var currency models.Currency

	if err = json.Unmarshal(requestBody, &currency); err != nil {
		fmt.Println("error trying to Unmarshal request body: ", err)
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if err = syncCurrencyController.service.InsertCurrency(currency); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusCreated, currency)
}

func (syncCurrencyController SyncCurrencyController) DeleteCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	parameters := mux.Vars(request)
	currencyNameParam := parameters["name"]

	if err := syncCurrencyController.service.DeleteCurrency(currencyNameParam); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, nil)
}
