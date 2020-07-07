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
	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

type (
	ErrCoinCode string

	ErrCoinHTTPResponse struct {
		Code    ErrCoinCode `json:"code"`    // Error code
		Message string      `json:"message"` // Error message
	}
)

type (
	ConvertCoinHTTPQueryParams struct {
		From   string `validate:"enum=USD,BRL,EUR,BTC,ETH"` // Converted coin
		To     string `validate:"enum=USD,BRL,EUR,BTC,ETH"` // Converted coin
		Amount int64  `validate:"min=1"`
	}

	CoinHTTPResponse struct {
		Name   string    `json:"name"`   // Coin name
		Amount int64     `json:"amount"` // Coin amount
		When   time.Time `json:"when"`   // Coin quotation time
	}
)

const (
	ErrCoinCodeInvalidQueryParams ErrCoinCode = "ERR_CONVERT_COIN_INVALID_QUERY_PARAMS"
	ErrCoinCodeConvert            ErrCoinCode = "ERR_CONVERT_COIN"
)

func newErrorCoinHTTPResponse(code ErrCoinCode, err error) ErrCoinHTTPResponse {
	return ErrCoinHTTPResponse{
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

// v1ConvertCoinValue godoc
// @Summary Convert coin
// @Description Resource to convert coins as USD, BRL, EUR, BTC, ETH
// @Produce  json
// @Param from query string true "Coin that will be converted"
// @Param to query string true "Converted coin"
// @Param amount query integer true "Coin amount that will be converted"
// @Success 200 {object} CoinHTTPResponse
// @Failure 400 {object} ErrCoinHTTPResponse
// @Failure 500 {object} ErrCoinHTTPResponse
// @Router /v1/coins/convert [get]
func v1ConvertCoinValue(s coin.Service) http.HandlerFunc {
	validator := gody.NewValidator()
	validator.AddRules(rule.Enum)

	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		amount, err := strconv.ParseInt(query.Get("amount"), 10, 64)
		if err != nil {
			cerr := newErrorCoinHTTPResponse(ErrCoinCodeInvalidQueryParams, errors.New("invalid amount field"))
			writeJSON(w, http.StatusBadRequest, cerr)
			return
		}

		params := ConvertCoinHTTPQueryParams{
			From:   query.Get("from"),
			To:     query.Get("to"),
			Amount: amount,
		}

		isValidated, err := validator.Validate(params)
		if err != nil {
			if isValidated {
				if ce, ok := err.(*rule.ErrEnum); ok {
					cerr := newErrorCoinHTTPResponse(ErrCoinCodeInvalidQueryParams, ce)
					writeJSON(w, http.StatusBadRequest, cerr)
					return
				}

				if ce, ok := err.(*rule.ErrMin); ok {
					cerr := newErrorCoinHTTPResponse(ErrCoinCodeInvalidQueryParams, ce)
					writeJSON(w, http.StatusBadRequest, cerr)
					return
				}
			}
			return
		}

		from := coin.Coin{Name: params.From, Amount: params.Amount}
		to := params.To
		coinConverted, err := s.ConvertCoin(from, to)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, newErrorCoinHTTPResponse(ErrCoinCodeConvert, err))
			return
		}

		bodyResp := CoinHTTPResponse{Name: coinConverted.Name, Amount: coinConverted.Amount, When: time.Now()}
		writeJSON(w, http.StatusOK, bodyResp)
	}
}
