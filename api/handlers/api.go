package api

import (
	"curapi/logger"
	"encoding/json"
	"net/http"
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
