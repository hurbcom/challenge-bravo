package httputil

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

// Get make an HTTP GET request and returns response body
func Get(url string) ([]byte, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	if response.StatusCode >= 400 {
		return nil, fmt.Errorf("http request to %s got an error %d", url, response.StatusCode)
	}
	defer response.Body.Close()
	return ioutil.ReadAll(response.Body)
}
