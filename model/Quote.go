package model

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
)

type Quote interface {
	Initialize(key string) error
	Quote(symbol string) (float64, error)
}

type quoteResponse struct {
	Success   bool               `json:"success,omitempty"`
	Terms     string             `json:"terms,omitempty"`
	Privacy   string             `json:"privacy,omitempty"`
	Timestamp int                `json:"timestamp,omitempty"`
	Source    string             `json:"source,omitempty"`
	Target    string             `json:"target,omitempty"`
	Base      string             `json:"base,omitempty"`
	Date      string             `json:"date,omitempty"`
	Quotes    map[string]float64 `json:"quotes,omitempty"`
	Rates     map[string]float64 `json:"rates,omitempty"`
	Error     struct {
		Code int    `json:"code,omitempty"`
		Type string `json:"type,omitempty"`
		Info string `json:"info,omitempty"`
	} `json:"error,omitempty"`
}

func request(endPoint string, params map[string]string, response interface{}) error {

	// Parse url
	qURL, err := url.Parse(endPoint)
	if err != nil {
		log.Println(err)
		return err
	}

	// Prepare query parameters
	if params != nil {
		qParams := qURL.Query()
		for k, v := range params {
			qParams.Set(k, v)
		}
		qURL.RawQuery = qParams.Encode()
	}

	// Execute the request
	resp, err := http.Get(qURL.String())
	if err != nil {
		log.Println(err)
		return err
	}
	defer func(Body io.ReadCloser) {
		err = Body.Close()
		if err != nil {
			log.Println(err)
		}
	}(resp.Body)

	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("status code: %s (%d)", resp.Status, resp.StatusCode)
		log.Println(err)
		return err
	}

	if response != nil {
		decoder := json.NewDecoder(resp.Body)
		if err = decoder.Decode(response); err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}
