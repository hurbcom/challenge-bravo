package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"sync"
	"time"
)

type Quote interface {
	Initialize(key string, refreshTimeout time.Duration) error
	Quote(symbol string) (float64, error)
	Terminate()
}

type baseQuote struct {
	key            string
	refreshTicker  *time.Ticker
	refreshQuit    chan bool
	refreshMutex   sync.Mutex
	refreshTimeout time.Duration
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

func (baseQuote *baseQuote) Initialize(key string, refreshTimeout time.Duration) error {

	// Check for empty key
	if len(key) == 0 {
		err := fmt.Errorf("empty key")
		log.Println(err)
		return err
	}

	// Save API key
	baseQuote.key = key
	baseQuote.refreshTimeout = refreshTimeout

	return nil
}

func (baseQuote *baseQuote) Quote(string) (float64, error) {
	return 0, fmt.Errorf("unimplement method. Please use the child classes")
}

func (baseQuote *baseQuote) getServiceRefresh() time.Duration {
	log.Println(fmt.Errorf("unimplement method. Please use the child classes"))
	return time.Hour
}

func (baseQuote *baseQuote) request(endPoint string, params map[string]string, response interface{}) error {

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

func (baseQuote *baseQuote) createTicker(symbol string, quoteFunc func(symbol string) (float64, error)) {

	baseQuote.refreshTicker = time.NewTicker(baseQuote.refreshTimeout)
	baseQuote.refreshQuit = make(chan bool)

	go func() {
		for {
			select {
			case <-baseQuote.refreshTicker.C:
				if _, err := quoteFunc(symbol); err != nil {
					log.Println(err)
					baseQuote.refreshQuit <- true
				}
			case <-baseQuote.refreshQuit:
				baseQuote.refreshTicker.Stop()
				return
			}
		}
	}()
}

func (baseQuote *baseQuote) Terminate() {
	baseQuote.refreshQuit <- true
}
