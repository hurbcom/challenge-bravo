package handler

import (
	"fmt"
	"net/http"
	"regexp"
	"time"

	"github.com/google/uuid"
	"github.com/hashicorp/go-hclog"
)

// Custom responseWrite to get status code and body then response
type ResponseWriteRecorder struct {
	StatusCode int
	Body       []byte
	log        hclog.Logger
	http.ResponseWriter
}

func (rwr *ResponseWriteRecorder) WriteHeader(statusCode int) {
	rwr.StatusCode = statusCode
	rwr.ResponseWriter.WriteHeader(statusCode)
}

func (rwr *ResponseWriteRecorder) Write(body []byte) (int, error) {
	rwr.Body = body
	return rwr.ResponseWriter.Write(body)
}

// Custom handler to logger the result of all requests
func HttpLogger(handler http.Handler, log hclog.Logger) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		reqTimeStart := time.Now()
		re := regexp.MustCompile(`\r?\n`)

		// The request id can be used to track the request across all microservices
		if req.Header.Get("X-Request-ID") == "" {
			req.Header.Set("X-Request-ID", uuid.New().String())
		}

		rwr := &ResponseWriteRecorder{
			StatusCode:     http.StatusOK,
			log:            log,
			ResponseWriter: rw,
		}

		handler.ServeHTTP(rwr, req)

		if rwr.StatusCode >= 200 && rwr.StatusCode < 300 {
			log.Info(
				"request successed",
				"request_id", req.Header.Get("X-Request-ID"),
				"protocol", "http",
				"method", req.Method,
				"path", req.RequestURI,
				"status_code", rwr.StatusCode,
				"status_text", http.StatusText(rwr.StatusCode),
				"duration", time.Since(reqTimeStart).String(),
			)
		} else if rwr.StatusCode >= 400 && rwr.StatusCode < 500 {
			log.Warn(
				"request failed",
				"req_id", req.Header.Get("X-Request-ID"),
				"protocol", "http",
				"method", req.Method,
				"path", req.RequestURI,
				"status_code", rwr.StatusCode,
				"status_text", http.StatusText(rwr.StatusCode),
				"duration", time.Since(reqTimeStart).String(),
				"body", re.ReplaceAllString(fmt.Sprintf("%s", rwr.Body), ""),
			)
		} else {
			log.Error(
				"request failed",
				"req_id", req.Header.Get("X-Request-ID"),
				"protocol", "http",
				"method", req.Method,
				"path", req.RequestURI,
				"status_code", rwr.StatusCode,
				"status_text", http.StatusText(rwr.StatusCode),
				"duration", time.Since(reqTimeStart).String(),
				"body", re.ReplaceAllString(fmt.Sprintf("%s", rwr.Body), ""),
			)
		}
	})
}
