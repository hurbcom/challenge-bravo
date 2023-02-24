package service_logger

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/hashicorp/go-hclog"
)

type LogRequestArgs []interface{}

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

func LogErrorRequest(log hclog.Logger, req *http.Request, msg string, err error) {
	logRequestArgs := LogSetRequestDefaultArgs(LogRequestArgs{"error", err}, req)
	log.Error(
		msg,
		logRequestArgs...,
	)
}

func LogSetRequestDefaultArgs(args LogRequestArgs, req *http.Request) LogRequestArgs {
	return append(args,
		"protocol", "http",
		"method", req.Method,
		"path", req.RequestURI,
		"req_id", req.Header.Get("X-Request-ID"),
		"ip_addr", requestGetRemoteAddress(req),
		"referer", req.Header.Get("Referer"),
		"userAgent", req.Header.Get("User-Agent"),
	)
}

func LogSetRequestFinishArgs(args LogRequestArgs, rwr *ResponseWriteRecorder, reqTimeStart time.Time) LogRequestArgs {
	return append(args,
		"status_code", rwr.StatusCode,
		"duration", time.Since(reqTimeStart).String(),
	)
}

func LogSetRequestBodyArg(args LogRequestArgs, rwr *ResponseWriteRecorder) LogRequestArgs {
	re := regexp.MustCompile(`\r?\n`)
	return append(args, "body", re.ReplaceAllString(fmt.Sprintf("%s", rwr.Body), ""))
}
