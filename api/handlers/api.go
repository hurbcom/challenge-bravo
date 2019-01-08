package api

import (
	"curapi/logger"
	"curapi/util"
	"encoding/json"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log
var err error

type HeartbeatResponse struct {
	Status string `json:"status"`
	Code   int    `json:"code"`
}

// HealthCheck :: Simple healthcheck endpoint that returns HTTP 200
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(HeartbeatResponse{Status: "OK", Code: 200})
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
