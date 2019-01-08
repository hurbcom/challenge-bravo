package api

import (
	"curapi/converter"
	"curapi/logger"
	"curapi/util"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	jsoniter "github.com/json-iterator/go"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log
var err error

// HeartbeatResponse :: Struct for Healthcheck
type HeartbeatResponse struct {
	Status string `json:"status"`
	Code   int    `json:"code"`
}

// OneErrorResponse :: Struct for error message
type OneErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// CurrencyResponse :: Struct for Currency converted response
type CurrencyResponse struct {
	Base string `json:"base"`
	From struct {
		Symbol string `json:"symbol"`
		Label  string `json:"description"`
	} `json:"from"`
	To struct {
		Symbol string `json:"symbol"`
		Label  string `json:"description"`
	} `json:"to"`
	Value float64 `json:"value"`
}

// HealthCheck :: Simple healthcheck endpoint that returns HTTP 200
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(HeartbeatResponse{Status: "OK", Code: 200})
}

// GetRate :: Get rate value for given currencies and amounts
func GetRate(w http.ResponseWriter, r *http.Request) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	qs := r.URL.Query()
	if qs != nil {
		from := strings.ToUpper(strings.Join(qs["from"], ""))
		to := strings.ToUpper(strings.Join(qs["to"], ""))
		amount, err := strconv.ParseFloat(strings.Join(qs["amount"], ""), 64)
		if err != nil {
			log.Error(err)
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(OneErrorResponse{Error: "Invalid amount. Please use dots instead commas."})
			return
		}

		// Pass values and do the conversion
		value, err := converter.CurrencyConverter(amount, from, to)
		if value != nil && err == nil {

			c := &CurrencyResponse{Base: "USD"}
			c.From.Symbol = from
			c.From.Label = converter.GetCurrencyLabel(from)
			c.To.Symbol = to
			c.To.Label = converter.GetCurrencyLabel(to)
			c.Value = *value
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			w.WriteHeader(http.StatusOK)
			jsoniter.NewEncoder(w).Encode(c)
			return
		}

		// Things messed, report in
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(OneErrorResponse{Error: "Could not convert currency data", Message: err.Error()})
		return
	}
}

// LoggingMiddleware :: Simple middleware for logging purposes
func LoggingMiddleware(next http.Handler) http.Handler {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		defer func() {
			elapsed := time.Since(startTime)
			ms := float64(elapsed) / float64(time.Millisecond)
			log.Infof("[%s] - %s %s (%.2fms)", util.GetRemoteIPAddress(r.RemoteAddr), r.Method, r.RequestURI, ms)
		}()
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
