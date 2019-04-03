package fixer

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

var ErrRequest = errors.New("error on processing request")

//FixerCaller is the generic request caller from Fixer API
type FixerCaller struct {
	Endpoint  string
	AccessKey string
}

//CallAPI makes a single request to the API
func (fc *FixerCaller) CallAPI(method, path string, body []byte) ([]byte, error) {
	client := &http.Client{
		Timeout: time.Second * 3,
	}

	url := fmt.Sprintf("%s/%s&access_key=%s", fc.Endpoint, path, fc.AccessKey)
	request, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, ErrRequest
	}

	response, err := client.Do(request)
	if err != nil {
		return nil, ErrRequest
	}
	if response.StatusCode >= 500 {
		return nil, ErrRequest
	}
	defer response.Body.Close()

	bodyBytes, err := ioutil.ReadAll(response.Body)
	return bodyBytes, err
}
