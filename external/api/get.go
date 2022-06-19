package api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// get is responsable to get the data from the external CoinAPI
func (e *Engine) get(url string) ([]byte, error) {
	var client = http.Client{
		Timeout: time.Second * 10,
	}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-CoinAPI-Key", e.token)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status code error: %d %s", resp.StatusCode, resp.Status)
	}
	defer resp.Body.Close()
	//We Read the response body on the line below.
	return ioutil.ReadAll(resp.Body)
}
