package services

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// Quote Currency quote service interface
type Quote interface {

	// Initialize the service where key is the service access key and refreshTimeout is the time frame
	// where the quotes will be updates by a job
	Initialize(key string) error

	// RefreshQuotes Refresh service quotes at cache and database
	RefreshQuotes() error

	// Terminate the service refresh job
	Terminate()
}

// baseQuote Common quote service implementation
type baseQuote struct {
	refreshTicker *time.Ticker
	refreshQuit   chan bool
	refreshMutex  sync.Mutex
	requestParams map[string]string
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

func (baseQuote *baseQuote) RefreshQuotes(string) (float64, error) {
	return 0, fmt.Errorf("unimplement method. Please use the child classes")
}

// initialize Commons initialization procedures for coinLayer, currencyLayer and Fixer services
func (baseQuote *baseQuote) initialize(key string, endpoint string, refreshFunc func() error) error {

	// Check for empty key
	if len(key) == 0 {
		err := fmt.Errorf("empty key")
		log.Println(err)
		return err
	}

	// Get a list of available coins and currencies
	var currencyList listResponse
	baseQuote.requestParams = make(map[string]string)
	baseQuote.requestParams["access_key"] = key
	if err := baseQuote.request(endpoint, baseQuote.requestParams, &currencyList); err != nil || !currencyList.Success {
		if !currencyList.Success {
			err = errors.New(strings.TrimSpace(currencyList.Error.Type + " " + currencyList.Error.Info))
			log.Println(err)
		}
		return err
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currencyList.getCurrencies(), false, false); err != nil {
		return err
	}

	// CacheContainer warm up
	if err := refreshFunc(); err != nil {
		return err
	}

	// Create refresh service
	baseQuote.createTicker(refreshFunc)

	return nil
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
	time.Sleep(time.Second * 2) // Sleeps a short time due free plan limitation
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
func (baseQuote *baseQuote) createTicker(refreshFunc func() error) {

	baseQuote.refreshTicker = time.NewTicker(dao.DefaultCacheTime)
	baseQuote.refreshQuit = make(chan bool)

	go func() {
		for {
			select {
			case <-baseQuote.refreshTicker.C:
				if err := refreshFunc(); err != nil {
					log.Println(err)
					baseQuote.refreshQuit <- true
				}
				log.Println("cache refresh executed")
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

// refresh Commons procedures for quote refresh process fo coinLayer, currencyLayer and Fixer services
func (baseQuote *baseQuote) refresh(endPoint string, assignFun func(*quoteResponse, *[]*model.Currency) *[]model.Currency) error {

	// Avoid concurrent calls
	baseQuote.refreshMutex.Lock()
	defer baseQuote.refreshMutex.Unlock()

	// Retrieve most recent quotes from service
	var latest quoteResponse
	if err := baseQuote.request(endPoint, baseQuote.requestParams, &latest); err != nil || !latest.Success {
		if !latest.Success {
			err = errors.New(strings.TrimSpace(latest.Error.Type + " " + latest.Error.Info))
		}
		return err
	}

	// Retrieve the currency list from database or cache
	var currencies []*model.Currency
	currency := model.Currency{}
	if err := currency.List(&currencies); err != nil {
		return err
	}

	// Save values to database and cache
	var currenciesUpdate = assignFun(&latest, &currencies)

	// Save the list to the database and cache
	if err := model.SaveCurrencies(*currenciesUpdate, true, true); err != nil {
		return err
	}

	return nil
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
		// Fix wrong value provided by currency layer
		if k == "BTC" {
			continue
		}
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	for k, v := range lr.Fiat {
		// Fix wrong value provided by currency layer
		if k == "BTC" {
			continue
		}
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	for k, v := range lr.Symbols {
		// Fix wrong value provided by currency layer
		if k == "BTC" {
			continue
		}
		currencies = append(currencies, model.Currency{
			Code: k,
			Name: v,
			Type: model.RealCurrency,
		})
	}
	return currencies
}
