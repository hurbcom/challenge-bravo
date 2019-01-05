package exchange_test

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"reflect"
	"testing"

	"github.com/alexruzenhack/challenge-bravo/exchange"
)

const succeed = "\u2713"
const failed = "\u2717"

func TestNewExchange(t *testing.T) {
	tests := []struct {
		name     string
		from     string
		to       string
		amount   float64
		exchange exchange.CurrencyOption
		client   exchange.QuoteClient
	}{
		{"from-usd-to-eur", "USD", "EUR", 100, (*exchange.Fiat)(nil), (*exchange.CurrencyLayerApi)(nil)},
		{"from-eur-to-brl", "EUR", "BRL", 100, (*exchange.Fiat)(nil), (*exchange.CurrencyLayerApi)(nil)},
		{"from-brl-to-btc", "BRL", "BTC", 100, (*exchange.Fiat)(nil), (*exchange.CurrencyLayerApi)(nil)},
		{"from-usd-to-eth", "USD", "ETH", 100, (*exchange.Crypto)(nil), (*exchange.CryptoCompareApi)(nil)},
		{"from-btc-to-usd", "BTC", "USD", 100, (*exchange.Crypto)(nil), (*exchange.CryptoCompareApi)(nil)},
		{"from-eth-to-eur", "ETH", "EUR", 100, (*exchange.Crypto)(nil), (*exchange.CryptoCompareApi)(nil)},
	}

	t.Log("Given the need to test the creation of a concrete object which implements Exchange interface.")
	{
		for i, tt := range tests {
			tf := func(t *testing.T) {

				wantExchangeType := reflect.TypeOf(tt.exchange).Elem()
				exchangeInterface := reflect.TypeOf((*exchange.CurrencyOption)(nil)).Elem()

				t.Logf("\tTest %d:\tWhen checking type %q for %q interface implementation.", i, wantExchangeType, exchangeInterface)
				{
					gotExchange := exchange.NewExchange(tt.from, tt.to, tt.amount)
					concreteObject := reflect.TypeOf(gotExchange)

					if !concreteObject.Implements(exchangeInterface) {
						t.Fatalf("\t%s\tShould concrete object %q implements the interface %q.", failed, concreteObject, exchangeInterface)
					}
					t.Logf("\t%s\tShould concrete object %q implements the interface %q.", succeed, concreteObject, exchangeInterface)

					gotExchangeType := concreteObject.Elem()
					if gotExchangeType != wantExchangeType {
						t.Fatalf("\t%s\tShould new exchange type be equal to %q : %q.", failed, wantExchangeType, gotExchangeType)
					}
					t.Logf("\t%s\tShould new exchange type be equal to %q.", succeed, wantExchangeType)

				}
			}

			t.Run(tt.name, tf)
		}
	}
}

func TestInvalidProcessError(t *testing.T) {
	tests := []struct {
		name     string
		exchange exchange.CurrencyOption
		err      error
		msg      string
	}{
		{
			name:     "fiat-invalidargument-from",
			exchange: &exchange.Fiat{From: "", To: "USD", Amount: 100},
			err:      &exchange.InvalidProcessError{Field: "From", Value: ""},
			msg:      "exchange: the value \"\" for field \"From\" can not be processed.",
		},
		{
			name:     "fiat-invalidargument-to",
			exchange: &exchange.Fiat{From: "USD", To: "", Amount: 100},
			err:      &exchange.InvalidProcessError{Field: "To", Value: ""},
			msg:      "exchange: the value \"\" for field \"To\" can not be processed.",
		},
		{
			name:     "fiat-invalidargument-amount",
			exchange: &exchange.Fiat{From: "USD", To: "EUR", Amount: 0},
			err:      &exchange.InvalidProcessError{Field: "Amount", Value: "0"},
			msg:      "exchange: the value \"0\" for field \"Amount\" can not be processed.",
		},
		{
			name:     "crypto-invalidargument-from",
			exchange: &exchange.Fiat{From: "", To: "ETH", Amount: 100},
			err:      &exchange.InvalidProcessError{Field: "From", Value: ""},
			msg:      "exchange: the value \"\" for field \"From\" can not be processed.",
		},
		{
			name:     "crypto-invalidargument-to",
			exchange: &exchange.Fiat{From: "ETH", To: "", Amount: 100},
			err:      &exchange.InvalidProcessError{Field: "To", Value: ""},
			msg:      "exchange: the value \"\" for field \"To\" can not be processed.",
		},
		{
			name:     "crytoe-invalidargument-amount",
			exchange: &exchange.Fiat{From: "BTC", To: "ETH", Amount: 0},
			err:      &exchange.InvalidProcessError{Field: "Amount", Value: "0"},
			msg:      "exchange: the value \"0\" for field \"Amount\" can not be processed.",
		},
	}

	t.Log("Given the need to test the erros for exchange processing implementation.")
	for i, tt := range tests {
		tf := func(t *testing.T) {
			{
				exchangeType := reflect.TypeOf(tt.exchange).Elem()
				t.Logf("\tTest %d:\tWhen checking \"Process()\" implementation for %q.", i, exchangeType)
				{
					_, err := tt.exchange.Process()

					wantType := reflect.TypeOf(tt.err).Elem()
					if gotType := reflect.TypeOf(err).Elem(); gotType != wantType {
						t.Fatalf("\t%s\tShould error type be equal to %q : %q", failed, wantType, gotType)
					}
					t.Logf("\t%s\tShould error type be equal to %q.", succeed, wantType)

					wantMessage := tt.msg
					if gotMessage := err.Error(); gotMessage != wantMessage {
						t.Errorf("\t%s\tShould error message be \"%s\" : \"%s\".", failed, wantMessage, gotMessage)
					}
					t.Logf("\t%s\tShould error message be \"%s\".", succeed, wantMessage)
				}
			}
		}

		t.Run(tt.name, tf)
	}
}

const currencyLayerFeed string = `{
		"success": true,
		"terms": "https:\/\/currencylayer.com\/terms",
		"privacy": "https:\/\/currencylayer.com\/privacy",
		"timestamp": 1546637346,
		"source": "USD",
		"quotes": {
			"USDUSD": 1,
			"USDEUR": 0.877305,
			"USDBRL": 3.714604,
			"USDBTC": 0.000261
		}
	}`

type currencyLayerTripper struct{}

func (currencyLayerTripper) RoundTrip(*http.Request) (*http.Response, error) {

	resp := &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(currencyLayerFeed)),
	}

	return resp, nil
}

const fixerIoFeed string = `{
		"success": true,
		"timestamp": 1546564745,
		"base": "EUR",
		"date": "2019-01-04",
		"rates": {
			"USD": 1.140609,
			"EUR": 1,
			"BRL": 4.28447,
			"BTC": 0.000299
	}`

type fixerIoTripper struct{}

func (fixerIoTripper) RoundTrip(*http.Request) (*http.Response, error) {

	resp := &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(fixerIoFeed)),
	}

	return resp, nil
}

const cryptoCompareFeed string = `{
		"USD": 3806.87,
		"EUR": 3322.09,
		"BRL": 14568,
		"BTC": 1,
		"ETH": 25.32
	}`

type cryptoCompareTripper struct{}

func (cryptoCompareTripper) RoundTrip(*http.Request) (*http.Response, error) {

	resp := &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(cryptoCompareFeed)),
	}

	return resp, nil
}

func NewClient(rt http.RoundTripper) *http.Client {
	return &http.Client{
		Transport: rt,
	}
}

func NewCurrencyLayerApi() exchange.QuoteClient {
	return exchange.CurrencyLayerApi{
		Client:  NewClient(currencyLayerTripper{}),
		BaseUrl: &url.URL{Host: "example.com", Path: "foo"},
		AuthKey: "something",
	}
}

func NewFixerIoApi() exchange.QuoteClient {
	return exchange.FixerIoApi{
		Client:  NewClient(fixerIoTripper{}),
		BaseUrl: &url.URL{Host: "example.com", Path: "foo"},
		AuthKey: "something",
	}
}

func NewCryptoCompareApi() exchange.QuoteClient {
	return exchange.CryptoCompareApi{
		Client:  NewClient(cryptoCompareTripper{}),
		BaseUrl: &url.URL{Host: "example.com", Path: "foo"},
		AuthKey: "something",
	}
}

func TestProcessExchangeOptions(t *testing.T) {
	tests := []struct {
		name     string
		exchange exchange.CurrencyOption
		out      *exchange.Order
	}{
		{
			name:     "fiat-samecurrency",
			exchange: &exchange.Fiat{From: "USD", To: "USD", Amount: 100},
			out:      &exchange.Order{From: "USD", To: "USD", Amount: 100, Quote: 1, Result: 100},
		},
		{
			name:     "fiat-from-usd-to-brl",
			exchange: &exchange.Fiat{From: "USD", To: "BRL", Amount: 100, QuoteClient: NewCurrencyLayerApi()},
			out:      &exchange.Order{From: "USD", To: "BRL", Amount: 100, Quote: 3.714604, Result: 371.460400},
		},
		{
			name:     "fiat-from-eur-to-brl",
			exchange: &exchange.Fiat{From: "EUR", To: "BRL", Amount: 100, QuoteClient: NewCurrencyLayerApi()},
			out:      &exchange.Order{From: "EUR", To: "BRL", Amount: 100, Quote: 4.234108, Result: 423.410786},
		},
		{
			name:     "fiat-from-brl-to-eur",
			exchange: &exchange.Fiat{From: "BRL", To: "EUR", Amount: 100, QuoteClient: NewCurrencyLayerApi()},
			out:      &exchange.Order{From: "BRL", To: "EUR", Amount: 100, Quote: 0.236177, Result: 23.617726},
		},
		{
			name:     "crypto-samecurrency",
			exchange: &exchange.Crypto{From: "BTC", To: "BTC", Amount: 100},
			out:      &exchange.Order{From: "BTC", To: "BTC", Amount: 100, Quote: 1, Result: 100},
		},
		{
			name:     "crypto-from-btc",
			exchange: &exchange.Crypto{From: "BTC", To: "BRL", Amount: 100, QuoteClient: NewCryptoCompareApi()},
			out:      &exchange.Order{From: "BTC", To: "BRL", Amount: 100, Quote: 14568, Result: 1456800},
		},
		{
			name:     "crypto-from-eth",
			exchange: &exchange.Crypto{From: "ETH", To: "BRL", Amount: 100, QuoteClient: NewCryptoCompareApi()},
			out:      &exchange.Order{From: "ETH", To: "BRL", Amount: 100, Quote: 575.355450, Result: 57535.545024},
		},
	}

	t.Log("Given the need to test the implementation for exchange processing.")
	for i, tt := range tests {
		tf := func(t *testing.T) {
			{
				exchangeType := reflect.TypeOf(tt.exchange).Elem()
				t.Logf("\tTest %d:\tWhen checking \"Process()\" implementation for %q.", i, exchangeType)
				{
					order, _ := tt.exchange.Process()

					wantType := reflect.TypeOf(tt.out).Elem()
					gotType := reflect.TypeOf(order).Elem()

					if gotType != wantType {
						t.Fatalf("\t%s\tShould %q type be equal to output type : %q", failed, wantType, gotType)
					}
					t.Logf("\t%s\tShould %q type be equal to output type.", succeed, wantType)

					if wantFromValue, gotFromValue := tt.out.From, order.From; wantFromValue != gotFromValue {
						t.Errorf("\t%s\tShould \"From\" field for Order be equal to %q : %q", failed, wantFromValue, gotFromValue)
					} else {
						t.Logf("\t%s\tShould \"From\" field for Order be equal to %q.", succeed, wantFromValue)
					}

					if wantToValue, gotToValue := tt.out.To, order.To; wantToValue != gotToValue {
						t.Errorf("\t%s\tShould \"To\" field for Order be equal to %q : %q", failed, wantToValue, gotToValue)
					} else {
						t.Logf("\t%s\tShould \"To\" field for Order be equal to %q.", succeed, wantToValue)
					}

					if wantAmountValue, gotAmountValue := tt.out.Amount, order.Amount; wantAmountValue != gotAmountValue {
						t.Errorf("\t%s\tShould \"Amount\" field for Order be equal to %f : %f", failed, wantAmountValue, gotAmountValue)
					} else {
						t.Logf("\t%s\tShould \"Amount\" field for Order be equal to %f.", succeed, wantAmountValue)
					}

					wantQuoteValue := fmt.Sprintf("%.6f", tt.out.Quote)
					gotQuoteValue := fmt.Sprintf("%.6f", order.Quote)
					if wantQuoteValue != gotQuoteValue {
						t.Errorf("\t%s\tShould \"Quote\" field for Order be equal to %v : %v", failed, wantQuoteValue, gotQuoteValue)
					} else {
						t.Logf("\t%s\tShould \"Quote\" field for Order be equal to %v.", succeed, wantQuoteValue)
					}

					wantResultValue := fmt.Sprintf("%.6f", tt.out.Result)
					gotResultValue := fmt.Sprintf("%.6f", order.Result)
					if wantResultValue != gotResultValue {
						t.Errorf("\t%s\tShould \"Result\" field for Order be equal to %v : %v", failed, wantResultValue, gotResultValue)
					} else {
						t.Logf("\t%s\tShould \"Result\" field for Order be equal to %v.", succeed, wantResultValue)
					}
				}
			}
		}

		t.Run(tt.name, tf)
	}
}
