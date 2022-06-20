package api

import (
	"fmt"
	"io/ioutil"
	"log"
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
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status code error: %d %s", resp.StatusCode, resp.Status)
	}
	defer func() {
		err = resp.Body.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return ioutil.ReadAll(resp.Body)
}
