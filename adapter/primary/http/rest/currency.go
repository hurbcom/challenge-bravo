package rest

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/guiferpa/gody/v2"
	"github.com/guiferpa/gody/v2/rule"
	"github.com/hurbcom/challenge-bravo/pkg/currency"
	"github.com/hurbcom/challenge-bravo/pkg/httputil"
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
		From   string `validate:"not_empty enum=USD,BRL,EUR,BTC,ETH"` // Converted currency
		To     string `validate:"not_empty enum=USD,BRL,EUR,BTC,ETH"` // Converted currency
		Amount int64  `validate:"min=1"`                              // Currency amount
	}

	CurrencyHTTPResponse struct {
		Name  string    `json:"name"`  // Currency name
		Value float64   `json:"value"` // Currency value
		When  time.Time `json:"when"`  // Currency quotation time
	}
)

const (
	ErrCurrencyCodeInvalidQueryParams ErrCurrencyCode = "ERR_CONVERT_CURRENCY_INVALID_QUERY_PARAMS"
	ErrCurrencyCodeConvert            ErrCurrencyCode = "ERR_CONVERT_CURRENCY"
)

// v1ConvertCurrencyValue godoc
// @Summary Convert currency
// @Description Resource to convert coins as USD, BRL, EUR, BTC, ETH
// @Produce  json
// @Param from query string true "Currency that will be converted"
// @Param to query string true "Converted currency"
// @Param amount query integer true "Currency amount that will be converted"
// @Success 200 {object} CurrencyHTTPResponse
// @Failure 400 {object} ErrCurrencyHTTPResponse
// @Failure 500 {object} ErrCurrencyHTTPResponse
// @Router /v1/currency/convert [get]
func v1ConvertCurrencyValue(s currency.PrimaryPort) http.HandlerFunc {
	validator := gody.NewValidator()
	if err := validator.AddRules(rule.Enum, rule.NotEmpty); err != nil {
		panic(err)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		amountString := query.Get("amount")
		if amountString == "" {
			resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeInvalidQueryParams, Message: "missing amount"}
			httputil.WriteJSON(w, http.StatusBadRequest, resp)
			return
		}

		amount, err := strconv.ParseInt(query.Get("amount"), 10, 64)
		if err != nil {
			resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeInvalidQueryParams, Message: fmt.Sprintf("amount: %s", err.Error())}
			httputil.WriteJSON(w, http.StatusBadRequest, resp)
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
					resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeInvalidQueryParams, Message: ce.Error()}
					httputil.WriteJSON(w, http.StatusBadRequest, resp)
					return
				}

				if ce, ok := err.(*rule.ErrMin); ok {
					resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeInvalidQueryParams, Message: ce.Error()}
					httputil.WriteJSON(w, http.StatusBadRequest, resp)
					return
				}

				if ce, ok := err.(*rule.ErrNotEmpty); ok {
					resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeInvalidQueryParams, Message: fmt.Sprintf("missing %s", ce.Field)}
					httputil.WriteJSON(w, http.StatusBadRequest, resp)
					return
				}
			}
			return
		}

		convertedCurrency, err := s.ConvertCurrency(params.From, params.To, params.Amount)
		if err != nil {
			resp := ErrCurrencyHTTPResponse{Code: ErrCurrencyCodeConvert, Message: err.Error()}
			httputil.WriteJSON(w, http.StatusBadRequest, resp)
			return
		}

		resp := CurrencyHTTPResponse{Name: convertedCurrency.Name, Value: convertedCurrency.Value, When: time.Now()}
		httputil.WriteJSON(w, http.StatusOK, resp)
	}
}
