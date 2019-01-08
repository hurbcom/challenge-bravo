package util

import (
	"challenge-bravo/logger"
	"io"
	"io/ioutil"
	"math"
	"net/http"
	"runtime"
	"strings"

	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log

type Request struct {
	Headers map[string]string
	Params  map[string]string
	Body    io.Reader
}

// ExecuteRequest :: Wrapper to fire HTTP requests and return HTTP response.
func ExecuteRequest(httpMethod, url string, request *Request) (*http.Response, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": GetPrefixName()})

	// Create HTTP client
	client := &http.Client{}
	headers := request.Headers
	body := request.Body
	params := request.Params
	req, err := http.NewRequest(httpMethod, url, body)
	if err != nil {
		log.Errorf("• Error: %s", err.Error())
	}

	// Set query parameters
	query := req.URL.Query()
	if params != nil {
		for k, v := range params {
			query.Add(k, v)
		}
		req.URL.RawQuery = query.Encode()
	}

	// Set headers for Request
	for k, v := range headers {
		req.Header.Add(k, v)
	}

	// Fire GET request
	resp, err := client.Do(req)
	if err != nil {
		log.Errorf("• Error: %s", err.Error())
	}

	// Logging response errors
	if resp.StatusCode != 200 {
		errorResponse, _ := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()
		log.Errorf("• Received response error: [%v] - %s", resp.StatusCode, errorResponse)

	}
	return resp, err
}

// GetPrefixName :: Helper func to return caller function name
func GetPrefixName(depthList ...int) string {
	var depth int
	if depthList == nil {
		depth = 1
	} else {
		depth = depthList[0]
	}
	function, _, _, _ := runtime.Caller(depth)
	fncName := runtime.FuncForPC(function).Name()
	fncNameSlice := strings.Split(fncName, ".")
	return fncNameSlice[1]
}

// GetRemoteIPAddress :: Simple function to parse IP address from given string
func GetRemoteIPAddress(r string) (ip string) {
	if strings.Contains(r, "[::1]") {
		return "localhost"
	}
	ip = strings.Split(r, ":")[0]
	return ip
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}
