package router

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/hashicorp/go-hclog"
)

type LogDefaultArgs []interface{}

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

		rw.Header().Add("Content-Type", "application/json; charset=utf-8")

		rwr := &ResponseWriteRecorder{
			StatusCode:     http.StatusOK,
			log:            log,
			ResponseWriter: rw,
		}

		handler.ServeHTTP(rwr, req)

		logDefautArgs := LogDefaultArgs{
			"protocol", "http",
			"method", req.Method,
			"path", req.RequestURI,
			"status_code", rwr.StatusCode,
			"duration", time.Since(reqTimeStart).String(),
			"req_id", req.Header.Get("X-Request-ID"),
			"ip_addr", requestGetRemoteAddress(req),
			"referer", req.Header.Get("Referer"),
			"userAgent", req.Header.Get("User-Agent"),
		}

		if rwr.StatusCode >= 100 && rwr.StatusCode < 200 {
			// (100 to 199) informational responses
			log.Info(
				"informational response",
				logDefautArgs...,
			)
		} else if rwr.StatusCode >= 200 && rwr.StatusCode < 300 {
			// (200 to 299) successful responses
			log.Info(
				"successful response",
				logDefautArgs...,
			)
		} else if rwr.StatusCode >= 300 && rwr.StatusCode < 400 {
			// (300 to 399) redirection messages
			log.Info(
				"redirection message",
				logDefautArgs...,
			)
		} else if rwr.StatusCode >= 400 && rwr.StatusCode < 500 {
			// (400 to 499) client error responses
			logDefautArgs = append(logDefautArgs, "body", re.ReplaceAllString(fmt.Sprintf("%s", rwr.Body), ""))
			log.Warn(
				"client error response",
				logDefautArgs...,
			)
		} else {
			// (500 to 599) server error responses
			logDefautArgs = append(logDefautArgs, "body", re.ReplaceAllString(fmt.Sprintf("%s", rwr.Body), ""))
			log.Error(
				"server error response",
				logDefautArgs...,
			)
		}
	})
}

// Request.RemoteAddress contains port, which we want to remove i.e.:
// "[::1]:58292" => "[::1]"
func ipAddrFromRemoteAddr(remoteAddr string) string {
	idx := strings.LastIndex(remoteAddr, ":")
	if idx == -1 {
		return remoteAddr
	}
	return remoteAddr[:idx]
}

// returns ip address of the client making the request,
// taking into account http proxies
func requestGetRemoteAddress(req *http.Request) string {
	reqHeader := req.Header
	headerRealIP := reqHeader.Get("X-Real-Ip")
	headerForwardedFor := reqHeader.Get("X-Forwarded-For")

	if headerRealIP == "" && headerForwardedFor == "" {
		return ipAddrFromRemoteAddr(req.RemoteAddr)
	}

	if headerForwardedFor != "" {
		// X-Forwarded-For is potentially a list of addresses separated with ","
		parts := strings.Split(headerForwardedFor, ",")
		for i, part := range parts {
			parts[i] = strings.TrimSpace(part)
		}
		// TODO: should return first non-local address
		return parts[0]
	}

	return headerRealIP
}
