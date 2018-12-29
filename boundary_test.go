package boundary_test

import (
	"encoding/json"
	"net/http"
	"testing"
)

const succeed = "\u2713"
const failed = "\u2717"

func TestStatusCurrencyLayerApi(t *testing.T) {
	tests := []struct {
		name       string
		url        string
		statusCode int
	}{
		{"statusok", "http://www.apilayer.net/api/live?access_key=48572306fc8a1bfe0caac72ddb60bab6&currencies=USD,EUR,BRL,BTC,ETH&format=1", http.StatusOK},
	}

	t.Log("Given the need to test the external API endpoint.")
	{
		for i, tt := range tests {
			tf := func(t *testing.T) {
				t.Logf("\tTest %d:\tWhen checking %q for status code %d", i, tt.url, tt.statusCode)
				{
					resp, err := http.Get(tt.url)
					if err != nil {
						t.Fatalf("\t%s\tShould be able to make the Get call: %v", failed, err)
					}
					t.Logf("\t%s\tShould be able to make the Get call.", succeed)

					defer resp.Body.Close()

					if resp.StatusCode == tt.statusCode {
						t.Logf("\t%s\tShould receive a %d status code.", succeed, tt.statusCode)
					} else {
						t.Errorf("\t%s\tShoul receive a status %d status code: %d", failed, tt.statusCode, resp.StatusCode)
					}
				}
			}

			t.Run(tt.name, tf)
		}
	}
}

func TestContentCurrencyLayerApi(t *testing.T) {
	apiUrl := "http://www.apilayer.net/api/live?access_key=48572306fc8a1bfe0caac72ddb60bab6&currencies=USD,EUR,BRL,BTC,ETH&format=1"
	t.Log("Given the need to test the external API endpoint content.")
	{
		t.Logf("\tTest 0:\tWhen checking %q for apropriate content", apiUrl)
		{
			resp, _ := http.Get(apiUrl)

			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				t.Fatalf("\t%s\tShould receive a status code of %d for the response. Received %d.", failed, http.StatusOK, resp.StatusCode)
			}
			t.Logf("\t%s\tShould receive a status code of %d for the response.", succeed, http.StatusOK)

			var d struct {
				Source string `json:"source"`
				Quotes struct {
					USDUSD float64
					USDEUR float64
					USDBRL float64
					USDBTC float64
					USDETH float64
				}
			}

			if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
				t.Fatalf("\t%s\tShould be able to decode de response. \n\t\t\t\tError: %q", failed, err)
			}
			t.Logf("\t%s\tShould be able to decode the response.", succeed)

			if d.Source == "USD" {
				t.Logf("\t%s\tShould have \"USD\" for \"source\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould have \"USD\" for \"source\" in the response : %q", failed, d.Source)
			}

			if d.Quotes.USDUSD == 1 {
				t.Logf("\t%s\tShould have 1 for \"quotes.USDUSD\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould have 1 for \"quotes.USDUSD\" in the response : %f", failed, d.Quotes.USDUSD)
			}

			if d.Quotes.USDEUR != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.USDEUR\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.USDEUR\" in the response : %f.", failed, d.Quotes.USDEUR)
			}

			if d.Quotes.USDBRL != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.USDBRL\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.USDBRL\" in the response : %f.", failed, d.Quotes.USDBRL)
			}

			if d.Quotes.USDBTC != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.USDBTC\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.USDBTC\" in the response : %f.", failed, d.Quotes.USDBTC)
			}
		}
	}
}

func TestStatusFixerApi(t *testing.T) {
	// this is the api to give resilience to the service
	tests := []struct {
		name       string
		url        string
		statusCode int
	}{
		{"statusok", "http://data.fixer.io/api/latest?access_key=831abeffcbd203278ab9363e123a465e&symbols=USD,EUR,BRL,BTC,ETH", http.StatusOK},
	}

	t.Log("Given the need to test the external API endpoint.")
	{
		for i, tt := range tests {
			tf := func(t *testing.T) {
				t.Logf("\tTest %d:\tWhen checking %q for status code %d", i, tt.url, tt.statusCode)
				{
					resp, err := http.Get(tt.url)
					if err != nil {
						t.Fatalf("\t%s\tShould be able to make the Get call: %v", failed, err)
					}
					t.Logf("\t%s\tShould be able to make the Get call.", succeed)

					defer resp.Body.Close()

					if resp.StatusCode == tt.statusCode {
						t.Logf("\t%s\tShould receive a %d status code.", succeed, tt.statusCode)
					} else {
						t.Errorf("\t%s\tShoul receive a status %d status code: %d", failed, tt.statusCode, resp.StatusCode)
					}
				}
			}

			t.Run(tt.name, tf)
		}
	}
}

func TestContentFixerApi(t *testing.T) {
	apiUrl := "http://data.fixer.io/api/latest?access_key=831abeffcbd203278ab9363e123a465e&&format=1&symbols=USD,EUR,BRL,BTC,ETH"

	t.Log("Given the need to test the external API endpoint content.")
	{
		t.Logf("\tTest 0:\tWhen checking %q for apropriate content", apiUrl)
		{
			resp, _ := http.Get(apiUrl)

			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				t.Fatalf("\t%s\tShould receive a status code of %d for the response. Received %d.", failed, http.StatusOK, resp.StatusCode)
			}
			t.Logf("\t%s\tShould receive a status code of %d for the response.", succeed, http.StatusOK)

			var d struct {
				Base  string `json:"base"`
				Rates struct {
					USD float64
					EUR float64
					BRL float64
					BTC float64
					ETH float64
				} `json:"rates"`
			}

			if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
				t.Fatalf("\t%s\tShould be able to decode de response. \n\t\t\t\tError: %q", failed, err)
			}
			t.Logf("\t%s\tShould be able to decode the response.", succeed)

			if d.Base == "EUR" {
				t.Logf("\t%s\tShould have \"EUR\" for \"Base\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould have \"EUR\" for \"Base\" in the response : %q", failed, d.Base)
			}

			if d.Rates.EUR == 1 {
				t.Logf("\t%s\tShould have 1 for \"quotes.EUR\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould have 1 for \"quotes.EUR\" in the response : %f", failed, d.Rates.USD)
			}

			if d.Rates.USD != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.USD\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.USD\" in the response : %f.", failed, d.Rates.USD)
			}

			if d.Rates.BRL != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.BRL\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.BRL\" in the response : %f.", failed, d.Rates.BRL)
			}

			if d.Rates.BTC != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"quotes.BTC\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"quotes.BTC\" in the response : %f.", failed, d.Rates.BTC)
			}
		}
	}
}

func TestStatusCryptoCompareApi(t *testing.T) {
	// this is the api that allow BTC and ETH convertions
	tests := []struct {
		name       string
		url        string
		statusCode int
	}{
		{"statusok-btc", "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR,BRL&api_key=3a1e10d48e086203801d91523f454d48a7a677db37040ce5cb2cfb38dee91b47", http.StatusOK},
		{"statusok-eth", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,BRL&api_key=3a1e10d48e086203801d91523f454d48a7a677db37040ce5cb2cfb38dee91b47", http.StatusOK},
	}

	t.Log("Given the need to test the external API endpoint.")
	{
		for i, tt := range tests {
			tf := func(t *testing.T) {
				t.Logf("\tTest %d:\tWhen checking %q for status code %d", i, tt.url, tt.statusCode)
				{
					resp, err := http.Get(tt.url)
					if err != nil {
						t.Fatalf("\t%s\tShould be able to make the Get call: %v", failed, err)
					}
					t.Logf("\t%s\tShould be able to make the Get call.", succeed)

					defer resp.Body.Close()

					if resp.StatusCode == tt.statusCode {
						t.Logf("\t%s\tShould receive a %d status code.", succeed, tt.statusCode)
					} else {
						t.Errorf("\t%s\tShoul receive a status %d status code: %d", failed, tt.statusCode, resp.StatusCode)
					}
				}
			}

			t.Run(tt.name, tf)
		}
	}
}

func TestContentCryptoCompareApi(t *testing.T) {
	apiUrl := "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR,BRL&api_key=3a1e10d48e086203801d91523f454d48a7a677db37040ce5cb2cfb38dee91b47"

	t.Log("Given the need to test the external API endpoint content.")
	{
		t.Logf("\tTest 0:\tWhen checking %q for apropriate content", apiUrl)
		{
			resp, _ := http.Get(apiUrl)

			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				t.Fatalf("\t%s\tShould receive a status code of %d for the response. Received %d.", failed, http.StatusOK, resp.StatusCode)
			}
			t.Logf("\t%s\tShould receive a status code of %d for the response.", succeed, http.StatusOK)

			var d struct {
				USD float64
				EUR float64
				BRL float64
			}

			if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
				t.Fatalf("\t%s\tShould be able to decode de response. \n\t\t\t\tError: %q", failed, err)
			}
			t.Logf("\t%s\tShould be able to decode the response.", succeed)

			if d.USD != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"USD\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"USD\" in the response : %f.", failed, d.USD)
			}

			if d.EUR != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"EUR\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"EUR\" in the response : %f.", failed, d.EUR)
			}

			if d.BRL != 0 {
				t.Logf("\t%s\tShould be different then 0 for \"BRL\" in the response.", succeed)
			} else {
				t.Errorf("\t%s\tShould be different then 0 for \"BRL\" in the response : %f.", failed, d.BRL)
			}
		}
	}
}
