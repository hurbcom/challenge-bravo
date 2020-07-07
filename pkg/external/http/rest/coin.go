package rest

import (
	"net/http"
	"time"

	"github.com/hurbcom/challenge-bravo/pkg/boleto"
)

type (
	ErrCoinCode         string
	ErrCoinHTTPResponse struct {
		Code    ErrCoinCode `json:"code"`    // Error code
		Message string      `json:"message"` // Error message
	}
)

type (
	CoinHTTPResponse struct {
		Name  string    `json:"name"`  // Coin name
		Value string    `json:"value"` // Coin value
		When  time.Time `json:"when"`  // Coin quotation time
	}
)

// v1ConvertCoinValue godoc
// @Summary Convert coin
// @Description Resource to convert coins as USD, BRL, EUR, BTC, ETH
// @Produce  json
// @Success 200 {object} CoinHTTPResponse
// @Failure 400 {object} ErrCoinHTTPResponse
// @Failure 422 {object} ErrCoinHTTPResponse
// @Failure 500 {object} ErrCoinHTTPResponse
// @Router /v1/coins/convert [post]
func v1ConvertCoinValue(s boleto.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
	}
}
