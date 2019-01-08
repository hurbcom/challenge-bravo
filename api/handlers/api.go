package api

import (
	"challenge-bravo/cache"
	"challenge-bravo/converter"
	"challenge-bravo/logger"
	"challenge-bravo/util"
	"net/http"
	"strconv"
	"strings"
	"time"

	jsoniter "github.com/json-iterator/go"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log
var err error

const curBase = "USD"

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

// RatesResponse :: Struct for All rates response
type RatesResponse struct {
	Base      string            `json:"base"`
	Timestamp time.Time         `json:"updated_at"`
	Rates     map[string]string `json:"rates"`
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
	jsoniter.NewEncoder(w).Encode(HeartbeatResponse{Status: "OK", Code: 200})
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
			jsoniter.NewEncoder(w).Encode(OneErrorResponse{Error: "Invalid amount. Please use dots instead commas."})
			return
		}

		// Pass values and do the conversion
		value, err := converter.CurrencyConverter(amount, from, to)
		if value != nil && err == nil {

			c := &CurrencyResponse{Base: curBase}
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
		jsoniter.NewEncoder(w).Encode(OneErrorResponse{Error: "Could not convert currency data", Message: err.Error()})
		return
	}
}

// GetAllRates :: Get all currently available rates
func GetAllRates(w http.ResponseWriter, r *http.Request) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	timestamp, rates, err := cache.GetAll()
	if err != nil {
		log.Error(err)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusInternalServerError)
		jsoniter.NewEncoder(w).Encode(OneErrorResponse{Error: "Rates currently unavailable. Please try again."})
		return
	}

	if rates != nil && len(rates) > 1 && timestamp != nil {
		t := time.Unix(int64(*timestamp), 0)
		rr := &RatesResponse{Base: curBase}
		rr.Timestamp = t
		rr.Rates = rates

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		jsoniter.NewEncoder(w).Encode(rr)
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
