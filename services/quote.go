package services

import (
	"challenge-bravo/model"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"sync"
	"time"
)

// Quote Currency quote service interface
type Quote interface {

	// Initialize the service where key is the service access key and refreshTimeout is the time frame
	// where the quotes will be updates by a job
	Initialize(key string, refreshTimeout time.Duration) error

	// Quote a symbol from the service/cache
	Quote(symbol string) (float64, error)

	// Terminate the service refresh job
	Terminate()
}

// baseQuote Common quote service implementation
type baseQuote struct {
	key            string
	refreshTicker  *time.Ticker
	refreshQuit    chan bool
	refreshMutex   sync.Mutex
	refreshTimeout time.Duration
}

// quoteResponse Currency quote response for all currency for fixer, currencyLayer and coinLayer family
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

// listResponse Available currencies response for fixer, currencyLayer and coinLayer family
type listResponse struct {
	Success bool   `json:"success"`
	Terms   string `json:"terms,omitempty"`
	Privacy string `json:"privacy,omitempty"`
	Crypto  map[string]struct {
		Symbol    string      `json:"symbol,omitempty"`
		Name      string      `json:"name,omitempty"`
		NameFull  string      `json:"name_full,omitempty"`
		MaxSupply interface{} `json:"max_supply,omitempty"`
		IconURL   string      `json:"icon_url,omitempty"`
	} `json:"crypto,omitempty"`
	Symbols    map[string]string `json:"symbols,omitempty"`
	Fiat       map[string]string `json:"fiat,omitempty"`
	Currencies map[string]string `json:"currencies,omitempty"`
	Error      struct {
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

// request Execute a request to fixer, currencyLayer and coinLayer currency quote service family
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

	// Decode the response
	if response != nil {
		decoder := json.NewDecoder(resp.Body)
		if err = decoder.Decode(response); err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}

// createTicker Create a job to refresh the currency quotes
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

// Terminate the job to refresh the currency quotes
func (baseQuote *baseQuote) Terminate() {
	baseQuote.refreshQuit <- true
}

// getCurrencies converts listResponse to a vector of model.Currency
func (lr *listResponse) getCurrencies() []model.Currency {
	var currencies []model.Currency
	for k, v := range lr.Crypto {
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v.Name,
			Type: model.CryptoCurrency,
		})
	}
	for k, v := range lr.Currencies {
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	for k, v := range lr.Fiat {
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	for k, v := range lr.Symbols {
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	return currencies
}
