// Package worker provide a worker that updates a given Price data structure
// with current prices of supported currencies
// Prices are gotten from openexchangesrates API and coinmaketcap
// (Etherium price will be treated differently from the others)
package worker

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
	"github.com/yagotome/challenge-bravo/utils/sliceutil"
)

// OpenExchangeRatesResponse Response model for rates extracting from openexchangerates
type OpenExchangeRatesResponse struct {
	Rates map[string]float64 `json:"rates"`
}

// CoinMarketCapResponse Response model to extract ETH price from coinmarketcap
type CoinMarketCapResponse struct {
	PriceUsd string `json:"price_usd"`
}

const ethSymbol = "ETH"

var (
	supportedCurrencies = []string{
		"USD",
		"BRL",
		"EUR",
		"BTC",
		ethSymbol,
	}
	wg = sync.WaitGroup{}
)

// Run is the function that runs worker task
func Run(p *currency.Price, c config.Config, wgFirstUpdated *sync.WaitGroup) {
	runTasks(p, &c, treatErrorFirstUpdate)
	wgFirstUpdated.Done()
	for {
		runTasks(p, &c, treatError)
		time.Sleep(time.Millisecond * time.Duration(c.WorkerUpdateInterval))
	}
}

func runTasks(p *currency.Price, c *config.Config, errorHanler func(error)) {
	wg.Add(2)
	go errorHanler(updateFromOpenExchangeRates(p, c))
	go errorHanler(updateFromCoinMarketCap(p, c))
	wg.Wait()
}

func treatErrorFirstUpdate(e error) {
	defer wg.Done()
	if e != nil {
		log.Panic(e)
	}
}

func treatError(e error) {
	defer wg.Done()
	if e != nil {
		log.Println(e)
	}
}

func request(url string) ([]byte, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	return ioutil.ReadAll(response.Body)
}

func getCoinOpenExchangeRates(url string) (*OpenExchangeRatesResponse, error) {
	buf, err := request(url)
	if err != nil {
		return nil, err
	}
	data := &OpenExchangeRatesResponse{}
	err = json.Unmarshal(buf, data)
	return data, err
}

// updateFromOpenExchangeRates updates all prices (expect ETH) from OpenExchangeRates.
// That API gives value of 1 USD in each supported currency
func updateFromOpenExchangeRates(p *currency.Price, conf *config.Config) error {
	url := fmt.Sprintf("%s?app_id=%s", conf.QuotesAPIURL.OpenExchangeRates, conf.APIKeys.OpenExchangeRates)
	resp, err := getCoinOpenExchangeRates(url)
	if err != nil {
		return err
	}
	for _, c := range supportedCurrencies {
		if price, ok := resp.Rates[c]; ok {
			p.Save(c, price)
		}
	}
	return nil
}

func getCoinMarketCapResponse(url string) ([]CoinMarketCapResponse, error) {
	buf, err := request(url)
	if err != nil {
		return nil, err
	}
	var data []CoinMarketCapResponse
	err = json.Unmarshal(buf, &data)
	return data, err
}

// updateFromCoinMarketCap updates Etherium price from CoinMarketCap.
// That API gives value of 1 ETH in USD, so it needs to be inverted
func updateFromCoinMarketCap(p *currency.Price, conf *config.Config) error {
	resp, err := getCoinMarketCapResponse(conf.QuotesAPIURL.CoinMarketCap)
	if err != nil {
		return err
	}
	price, err := strconv.ParseFloat(resp[0].PriceUsd, 64)
	if err != nil {
		return err
	}
	p.Save(ethSymbol, currency.InvertPrice(price))
	return nil
}

// IsSupported returns if a currency is supported by the worker
func IsSupported(curSymb string) bool {
	return sliceutil.Contains(supportedCurrencies, curSymb)
}
