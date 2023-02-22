package router

import (
	"net/http"
	"time"

	logger "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/logger"
	"github.com/google/uuid"
	"github.com/hashicorp/go-hclog"
)

// Custom handler to logger the result of all requests
func HttpLogger(handler http.Handler, log hclog.Logger) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		reqTimeStart := time.Now()

		// The request id can be used to track the request across all microservices
		if req.Header.Get("X-Request-ID") == "" {
			req.Header.Set("X-Request-ID", uuid.New().String())
		}

		rw.Header().Add("Content-Type", "application/json; charset=utf-8")

		rwr := &logger.ResponseWriteRecorder{
			StatusCode:     http.StatusOK,
			Body:           []byte{},
			ResponseWriter: rw,
		}

		handler.ServeHTTP(rwr, req)

		logRequestArgs := logger.LogSetRequestDefaultArgs(logger.LogRequestArgs{}, req)
		logRequestArgs = logger.LogSetRequestFinishArgs(logRequestArgs, rwr, reqTimeStart)

		if rwr.StatusCode >= 100 && rwr.StatusCode < 200 {
			// (100 to 199) informational responses
			log.Info(
				"informational response",
				logRequestArgs...,
			)
		} else if rwr.StatusCode >= 200 && rwr.StatusCode < 300 {
			// (200 to 299) successful responses
			log.Info(
				"successful response",
				logRequestArgs...,
			)
		} else if rwr.StatusCode >= 300 && rwr.StatusCode < 400 {
			// (300 to 399) redirection messages
			log.Info(
				"redirection message",
				logRequestArgs...,
			)
		} else if rwr.StatusCode >= 400 && rwr.StatusCode < 500 {
			// (400 to 499) client error responses
			logRequestArgs = logger.LogSetRequestBodyArg(logRequestArgs, rwr)
			log.Warn(
				"client error response",
				logRequestArgs...,
			)
		} else {
			// (500 to 599) server error responses
			logRequestArgs = logger.LogSetRequestBodyArg(logRequestArgs, rwr)
			log.Error(
				"server error response",
				logRequestArgs...,
			)
		}
	})
}
