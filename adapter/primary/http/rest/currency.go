package rest

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/guiferpa/gody/v2"
	"github.com/guiferpa/gody/v2/rule"
	"github.com/hurbcom/challenge-bravo/pkg/currency"
)

type (
	ErrCurrencyCode string

	ErrCurrencyHTTPResponse struct {
		Code    ErrCurrencyCode `json:"code"`    // Error code
		Message string          `json:"message"` // Error message
	}
)

type (
	ConvertCurrencyHTTPQueryParams struct {
		From   string `validate:"enum=USD,BRL,EUR,BTC,ETH"` // Converted coin
		To     string `validate:"enum=USD,BRL,EUR,BTC,ETH"` // Converted coin
		Amount int64  `validate:"min=1"`                    // Coin amount
	}

	CurrencyHTTPResponse struct {
		Name  string    `json:"name"`  // Coin name
		Value float64   `json:"value"` // Coin value
		When  time.Time `json:"when"`  // Coin quotation time
	}
)

const (
	ErrCurrencyCodeInvalidQueryParams ErrCurrencyCode = "ERR_CONVERT_CURRENCY_INVALID_QUERY_PARAMS"
	ErrCurrencyCodeConvert            ErrCurrencyCode = "ERR_CONVERT_CURRENCY"
)

func newErrorCurrencyHTTPResponse(code ErrCurrencyCode, err error) ErrCurrencyHTTPResponse {
	return ErrCurrencyHTTPResponse{
		Code:    code,
		Message: err.Error(),
	}
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Add("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.SetOutput(os.Stderr)
		log.SetPrefix("[challenge-bravo] [API] writeJSON")
		log.Println(err.Error())

		w.WriteHeader(http.StatusInternalServerError)
	}
}

// v1ConvertCurrencyValue godoc
// @Summary Convert coin
// @Description Resource to convert coins as USD, BRL, EUR, BTC, ETH
// @Produce  json
// @Param from query string true "Coin that will be converted"
// @Param to query string true "Converted coin"
// @Param amount query integer true "Coin amount that will be converted"
// @Success 200 {object} CurrencyHTTPResponse
// @Failure 400 {object} ErrCurrencyHTTPResponse
// @Failure 500 {object} ErrCurrencyHTTPResponse
// @Router /v1/currency/convert [get]
func v1ConvertCurrencyValue(s currency.PrimaryPort) http.HandlerFunc {
	validator := gody.NewValidator()
	if err := validator.AddRules(rule.Enum); err != nil {
		panic(err)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		amount, err := strconv.ParseInt(query.Get("amount"), 10, 64)
		if err != nil {
			cerr := newErrorCurrencyHTTPResponse(ErrCurrencyCodeInvalidQueryParams, errors.New("invalid amount field"))
			writeJSON(w, http.StatusBadRequest, cerr)
			return
		}

		params := ConvertCurrencyHTTPQueryParams{
			From:   query.Get("from"),
			To:     query.Get("to"),
			Amount: amount,
		}

		isValidated, err := validator.Validate(params)
		if err != nil {
			if isValidated {
				if ce, ok := err.(*rule.ErrEnum); ok {
					cerr := newErrorCurrencyHTTPResponse(ErrCurrencyCodeInvalidQueryParams, ce)
					writeJSON(w, http.StatusBadRequest, cerr)
					return
				}

				if ce, ok := err.(*rule.ErrMin); ok {
					cerr := newErrorCurrencyHTTPResponse(ErrCurrencyCodeInvalidQueryParams, ce)
					writeJSON(w, http.StatusBadRequest, cerr)
					return
				}
			}
			return
		}

		convertedCurrency, err := s.ConvertCurrency(params.From, params.To, params.Amount)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, newErrorCurrencyHTTPResponse(ErrCurrencyCodeConvert, err))
			return
		}

		bodyResp := CurrencyHTTPResponse{Name: convertedCurrency.Name, Value: convertedCurrency.Value, When: time.Now()}
		writeJSON(w, http.StatusOK, bodyResp)
	}
}
