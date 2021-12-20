// Endpoint methods to api
package router

import (
	"api/controllers"
	"api/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

// Variables used in another packages
var (
	MySql  *sql.DB
	Redis  *redis.Client
	Router *mux.Router
)

// Standardized answer
type ApiResponse struct {
	Data    []map[string]interface{} `json:"data"`
	Success bool                     `json:"success"`
	Message string                   `json:"message,omitempty"`
}

// Here we are implementing the NotImplemented handler. Whenever an API endpoint is hit
// we will simply return the message "Not Implemented"
var NotImplemented = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Not Implemented"))
})

// The status handler will be invoked when the user calls the /status route
// It will simply return a string with the message "API is up and running"
var StatusHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("API is up and running"))
})

// Endpoint to get converted exchange rates
func GetExchangeRates(w http.ResponseWriter, r *http.Request) {
	// Set default API result
	var response ApiResponse
	httpStatus := http.StatusInternalServerError
	response.Success = false
	// Get query string
	query := r.URL.Query()
	from := query.Get("from")
	to := query.Get("to")
	// From and To are mandatory
	if len(from) == 0 || len(to) == 0 {
		log.Println("Mandatory data(from or to) not present in request")
		response.Message = "Mandatory data(from or to) not present in request"
		jsonR, _ := json.Marshal(response)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonR)
		return
	}

	amount := query.Get("amount")
	// If amount is empty defined by value 1
	if len(amount) == 0 {
		amount = "1.00"
	}

	// Try get converted amount with exchange rate
	exchangerate, err := controllers.GetExchangeRatesConverter(MySql, Redis, from, to, amount)
	if err != nil {
		log.Printf("%s to get amount converted from %s\n", err, from)
	} else {
		jsonExc, err := json.Marshal(exchangerate.Data)
		if err != nil {
			log.Printf("%s to marshal exchange rate data from %s\n", err, from)
		} else {
			// Set data to API result
			err = json.Unmarshal(jsonExc, &response.Data)
			if err != nil {
				log.Printf("%s to unmarshal response data from currency code %s\n", err, from)
			} else {
				httpStatus = http.StatusOK
				response.Success = true
			}
		}
	}

	jsonR, _ := json.Marshal(response)
	if err != nil {
		log.Printf("%s to marshal response data exchange rates from %s\n", err, from)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	w.Write(jsonR)
}

// Endpoint to save/update currency code and exchange rates
func SaveCurrencyCodeAndExchangeRate(w http.ResponseWriter, r *http.Request) {
	var currencyCode models.CurrencyCode
	// Set default API result
	var response ApiResponse
	httpStatus := http.StatusInternalServerError
	if r.Body != nil {
		reqBody, _ := ioutil.ReadAll(r.Body)
		err := json.Unmarshal(reqBody, &currencyCode)
		if err != nil {
			log.Printf("%s to unmarshal currency code to save\n", err)
			httpStatus = http.StatusBadRequest
		} else {
			err := models.SaveCurrencyCode(MySql, currencyCode.Code)
			if err != nil {
				log.Printf("%s to save currency code in database\n", err)
			} else {
				// Save exchange rates if exists
				if len(currencyCode.Rates) > 0 {
					err = models.SaveExchangeHistoricalRates(MySql, currencyCode)
					if err != nil {
						log.Printf("%s to save exchange rates in database\n", err)
						response.Message = fmt.Sprintf("Currency code %s saved, but exchange rates not", currencyCode.Code)
					}
				}
				var currencyCodes []models.CurrencyCode
				currencyCodes = append(currencyCodes, currencyCode)
				currenciesCode := models.CurrenciesCode{Data: currencyCodes}
				jsonCur, err := json.Marshal(currenciesCode.Data)
				if err != nil {
					log.Printf("%s to marshal data to currency code\n", err)
				} else {
					// Set data to API result
					err = json.Unmarshal(jsonCur, &response.Data)
					if err != nil {
						log.Printf("%s to unmarshal response data to currency code\n", err)
					} else {
						httpStatus = http.StatusCreated
						response.Success = true
						response.Message = "Currency code successfull saved"
					}
				}
			}
		}
	} else {
		httpStatus = http.StatusBadRequest
	}

	jsonR, err := json.Marshal(response)
	if err != nil {
		log.Printf("%s to marshal response data to save currency code\n", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	w.Write(jsonR)
}

// Endpoint to delete currency code and exchange rates
func DeleteCurrencyCodeAndExchangeRate(w http.ResponseWriter, r *http.Request) {
	// Set default API result
	var response ApiResponse
	httpStatus := http.StatusInternalServerError
	params := mux.Vars(r)
	log.Printf("%v", mux.Vars(r))
	if currencyCode, ok := params["code"]; ok {
		err := models.DeleteExchangeHistoricalRates(MySql, currencyCode)
		if err != nil {
			log.Printf("%s to delete exchange rates in database\n", err)
		} else {
			err = models.DeleteCurrencyCode(MySql, currencyCode)
			if err != nil {
				log.Printf("%s to delete currency code in database\n", err)
				response.Message = fmt.Sprintf("Exchange rates removed, but currency code %s not", currencyCode)
			} else {
				httpStatus = http.StatusOK
				response.Success = true
				response.Message = "Currency code successfull deleted"
			}
		}
	} else {
		httpStatus = http.StatusBadRequest
	}

	jsonR, err := json.Marshal(response)
	if err != nil {
		log.Printf("%s to marshal response data to delete currency code\n", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	w.Write(jsonR)
}
