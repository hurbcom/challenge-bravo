package controllers

import (
	"challenge-bravo/src/models"
	"challenge-bravo/src/responses"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

type CurrencyService interface {
	Create(models.Currency) error
	Find(string) (models.Currency, error)
	Delete(string) (int64, error)
	ConvertCurrency(string, string, float64) (models.ResponseCurrency, error)
}

type CurrencyController struct {
	service CurrencyService
}

func NewCurrencyController(service CurrencyService) *CurrencyController {
	return &CurrencyController{service}
}

func (currControler CurrencyController) Create(w http.ResponseWriter, r *http.Request) {
	requestBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.Error(w, http.StatusUnprocessableEntity, err)
		return
	}

	defer r.Body.Close()

	var newCurrency models.Currency
	if err = json.Unmarshal(requestBody, &newCurrency); err != nil {
		responses.Error(w, http.StatusBadRequest, err)
		return
	}

	if err = currControler.service.Create(newCurrency); err != nil {
		responses.Error(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusCreated, nil)
}

func (currControler CurrencyController) Find(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	code := params["code"]

	result, err := currControler.service.Find(code)
	if err != nil {
		responses.Error(w, http.StatusInternalServerError, err)
	}
	responses.JSON(w, http.StatusOK, result)
}

func (currControler CurrencyController) Delete(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	code := params["code"]

	result, err := currControler.service.Delete(code)
	if err != nil {
		responses.Error(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusAccepted, result)
}

func (currControler CurrencyController) Convert(w http.ResponseWriter, r *http.Request) {
	fromCurrency := strings.ToUpper(r.URL.Query().Get("from"))
	toCurrency := strings.ToUpper(r.URL.Query().Get("to"))
	amount, err := strconv.ParseFloat(r.URL.Query().Get("amount"), 64)
	if err != nil {
		responses.Error(w, http.StatusInternalServerError, err)
		return
	}

	response, err := currControler.service.ConvertCurrency(fromCurrency, toCurrency, amount)
	if err != nil {
		responses.Error(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, response)
}
