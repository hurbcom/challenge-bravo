package exchange

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// CurrencyOption represents the interface of a specilized exchange option
type CurrencyOption interface {
	Process() (*Order, error)
}

// An Order object represents the result of an exchange process
type Order struct {
	From   string
	To     string
	Amount float64
	Quote  float64
	Result float64
}

// QuoteClient is an interface representing the ability to execute a
// consult in the external APIs of currency quotes
type QuoteClient interface {
	GetQuotes() (Quotes, error)
}

// Quotes gives uniformity to the data returned by different APIs
type Quotes map[string]float64

// IvalidProcessError can be returned by ExchangeOption.Process to
// inform which field is invalid and enable the controller to provide
// a better message to the consumer
type InvalidProcessError struct {
	Field string // name of the field holding the Go value
	Value string // description of field value
}

func (e *InvalidProcessError) Error() string {
	return fmt.Sprintf("exchange: the value %q for field %q can not be processed.", e.Value, e.Field)
}

// NewExchange instantiate a concrete implementation for Exchange interface based on "from" and "to" parameters
func NewExchange(from string, to string, amount float64) CurrencyOption {

	if isBtc(from) || isEth(from) || isEth(to) {
		api := CryptoCompareApi{
			Client:  &http.Client{Timeout: time.Second * 10},
			BaseUrl: &url.URL{Scheme: "https", Host: "min-api.cryptocompare.com"},
			AuthKey: "3a1e10d48e086203801d91523f454d48a7a677db37040ce5cb2cfb38dee91b47",
		}
		return &Crypto{From: from, To: to, Amount: amount, QuoteClient: api}
	}

	api := CurrencyLayerApi{
		Client:  &http.Client{Timeout: time.Second * 10},
		BaseUrl: &url.URL{Scheme: "http", Host: "www.apilayer.net"},
		AuthKey: "48572306fc8a1bfe0caac72ddb60bab6",
	}
	return &Fiat{From: from, To: to, Amount: amount, QuoteClient: api}
}

func isBtc(from string) bool {
	return strings.Contains(from, "BTC")
}

func isEth(from string) bool {
	return strings.Contains(from, "ETH")
}

// Fiat implements the CurrencyOption interface by proccessing an exchange order for fiat currencies
type Fiat struct {
	From        string
	To          string
	Amount      float64
	QuoteClient QuoteClient
}

// Process exchange order for fiat currency
func (e *Fiat) Process() (order *Order, err error) {
	if e.From == "" {
		return nil, &InvalidProcessError{Field: "From", Value: e.From}
	}

	if e.To == "" {
		return nil, &InvalidProcessError{Field: "To", Value: e.To}
	}

	if e.Amount <= 0 {
		return nil, &InvalidProcessError{Field: "Amount", Value: strconv.FormatFloat(e.Amount, 'f', -1, 32)}
	}

	if e.From == e.To {
		return &Order{From: e.From, To: e.To, Amount: e.Amount, Quote: 1, Result: e.Amount}, nil
	}

	quotes, err := e.QuoteClient.GetQuotes()
	if err != nil {
		return nil, err
	}

	sourceValue := quotes[e.From]
	targetValue := quotes[e.To]
	quote := targetValue / sourceValue
	result := quote * e.Amount

	exchangeOrder := &Order{From: e.From, To: e.To, Amount: e.Amount, Quote: quote, Result: result}

	return exchangeOrder, nil
}

// Crypto implements the CurrencyOption interface by processing an exchange order for crypto currencies
type Crypto struct {
	From        string
	To          string
	Amount      float64
	QuoteClient QuoteClient
}

// Process exchange order for crypto currency
func (e *Crypto) Process() (order *Order, err error) {
	if e.From == "" {
		return nil, &InvalidProcessError{Field: "From", Value: e.From}
	}

	if e.To == "" {
		return nil, &InvalidProcessError{Field: "To", Value: e.To}
	}

	if e.Amount <= 0 {
		return nil, &InvalidProcessError{Field: "Amount", Value: strconv.FormatFloat(e.Amount, 'f', -1, 32)}
	}

	if e.From == e.To {
		return &Order{From: e.From, To: e.To, Amount: e.Amount, Quote: 1, Result: e.Amount}, nil
	}

	quotes, err := e.QuoteClient.GetQuotes()
	if err != nil {
		return nil, err
	}

	sourceValue := quotes[e.From]
	targetValue := quotes[e.To]
	quote := targetValue / sourceValue
	result := quote * e.Amount

	exchangeOrder := &Order{From: e.From, To: e.To, Amount: e.Amount, Quote: quote, Result: result}
	return exchangeOrder, nil
}

type CurrencyLayerApi struct {
	Client  *http.Client
	BaseUrl *url.URL
	AuthKey string
}

func (api CurrencyLayerApi) GetQuotes() (Quotes, error) {
	api.BaseUrl.Path = "/api/live"

	q := api.BaseUrl.Query()
	q.Set("access_key", api.AuthKey)
	q.Set("currencies", "USD,EUR,BRL,BTC,ETH")
	q.Set("format", "1")
	api.BaseUrl.RawQuery = q.Encode()

	resp, err := api.Client.Get(api.BaseUrl.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var d struct {
		Quotes struct {
			USDUSD float64
			USDEUR float64
			USDBRL float64
			USDBTC float64
			USDETH float64
		} `json:"quotes"`
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	fixedRespBody := bytes.Replace(buf.Bytes(), []byte("\\"), []byte(""), -1)

	if err := json.NewDecoder(bytes.NewReader(fixedRespBody)).Decode(&d); err != nil {
		return nil, err
	}

	quotes := make(Quotes)
	quotes["USD"] = d.Quotes.USDUSD
	quotes["EUR"] = d.Quotes.USDEUR
	quotes["BRL"] = d.Quotes.USDBRL
	quotes["BTC"] = d.Quotes.USDBTC
	quotes["ETH"] = d.Quotes.USDETH

	return quotes, nil
}

type FixerIoApi struct {
	Client  *http.Client
	BaseUrl *url.URL
	AuthKey string
}

func (api FixerIoApi) GetQuotes() (Quotes, error) {
	api.BaseUrl.Path = "/api/latest"

	q := api.BaseUrl.Query()
	q.Set("acess_key", api.AuthKey)
	q.Set("symbols", "USD,EUR,BRL,BTC,ETH")
	q.Set("format", "1")
	api.BaseUrl.RawQuery = q.Encode()

	resp, err := api.Client.Get(api.BaseUrl.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var d struct {
		Rates struct {
			USD float64
			EUR float64
			BRL float64
			BTC float64
			ETH float64
		} `json:"rates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
		return nil, err
	}

	quotes := make(Quotes)
	quotes["USD"] = d.Rates.USD
	quotes["EUR"] = d.Rates.EUR
	quotes["BRL"] = d.Rates.BRL
	quotes["BTC"] = d.Rates.BTC
	quotes["ETH"] = d.Rates.ETH

	return quotes, nil
}

type CryptoCompareApi struct {
	Client  *http.Client
	BaseUrl *url.URL
	AuthKey string
}

func (api CryptoCompareApi) GetQuotes() (Quotes, error) {
	api.BaseUrl.Path = "/data/price"

	q := api.BaseUrl.Query()
	q.Set("api_key", api.AuthKey)
	q.Set("fsym", "BTC")
	q.Set("tsyms", "USD,EUR,BRL,BTC,ETH")
	api.BaseUrl.RawQuery = q.Encode()

	resp, err := api.Client.Get(api.BaseUrl.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var d struct {
		USD float64
		EUR float64
		BRL float64
		BTC float64
		ETH float64
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	fmt.Println(buf.String())

	if err := json.NewDecoder(bytes.NewReader(buf.Bytes())).Decode(&d); err != nil {
		return nil, err
	}

	quotes := make(Quotes)
	quotes["USD"] = d.USD
	quotes["EUR"] = d.EUR
	quotes["BRL"] = d.BRL
	quotes["BTC"] = d.BTC
	quotes["ETH"] = d.ETH

	return quotes, nil
}
