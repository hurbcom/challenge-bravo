package controllers

import (
	"api/src/models"
	"api/src/responses"
	"net/http"
)

type CurrencyService interface {
	//UpdateAllUpdatableCurrencies()
	GetCurrenciesBasedOnUSDFromAPI(string, []string) ([]models.ConversionRateFromAPI, error)
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	/*UpdateCurrency(models.Currency) error
	InsertCurrency(models.Currency) error
	DeleteCurrency(string) error*/
	GetAllCurrencies() ([]models.Currency, error)
}

type CurrencyController struct {
	service CurrencyService
}

func NewCurrencyController(service CurrencyService) *CurrencyController {
	return &CurrencyController{service}
}

func (currencyController CurrencyController) GetAllCurrencies(responseWriter http.ResponseWriter, request *http.Request) {

	allCurrencies, err := currencyController.service.GetAllCurrencies()
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, allCurrencies)
}

func (currencyController CurrencyController) GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {
	return currencyController.service.GetCurrenciesBasedOnUSDFromAPI(fromCurrency, toCurrencies)
}

/*
func (currencyController CurrencyController) UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")
	currencyController.service.UpdateAllUpdatableCurrencies()
}

func (currencyController CurrencyController) InsertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

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

	if err = currencyController.service.InsertCurrency(currency); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusCreated, currency)
}

func (currencyController CurrencyController) DeleteCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	parameters := mux.Vars(request)
	currencyNameParam := parameters["name"]

	if err := currencyController.service.DeleteCurrency(currencyNameParam); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, nil)
}
*/
