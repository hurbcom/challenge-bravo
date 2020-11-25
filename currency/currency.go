package currency

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const host = `https://api.exchangeratesapi.io/latest?base=USD`
const btcHost = `https://blockchain.info/tobtc?currency=USD&value=1`

type currency struct {
	raw        string
	btc        float64
	currencies map[string]float64
}

func NewCurrency() (Currency, error) {
	cur := &currency{
		raw: "",
		btc: 0,
		currencies: map[string]float64{
			"USD": 0,
			"BRL": 0,
			"EUR": 0,
			"BTC": 0,
			"ETH": 0,
		},
	}
	updateCurrencies(cur)
	go func() {
		for {
			<-time.Tick(time.Minute)
			updateCurrencies(cur)
		}
	}()
	return cur, nil
}

func (c *currency) AddCurrency(initials string) error {
	initials = strings.ToUpper(initials)
	if _, ok := c.currencies[initials]; ok {
		return nil
	}
	if initials == "BTC" {
		c.currencies[initials] = c.btc
		return nil
	}
	result := gjson.Get(c.raw, fmt.Sprintf("rates.%s", strings.ToUpper(initials)))
	if !result.Exists() {
		return ErrCurrencyNotExist
	}
	c.currencies[initials] = result.Float()
	return nil
}

func (c *currency) DeleteCurrency(initials string) {
	initials = strings.ToUpper(initials)
	delete(c.currencies, initials)
}

func (c *currency) Currency(initials string) (float64, error) {
	initials = strings.ToUpper(initials)
	if _, ok := c.currencies[initials]; !ok {
		return 0, ErrCurrencyNotExist
	}
	return c.currencies[initials], nil
}

func updateCurrencies(cur *currency) {
	body, err := getCurrencies()
	if err != nil {
		log.WithField("error", err.Error()).Errorf("failed to get new currencies")
		return
	}
	btc, err := getBtcCurrency()
	if err != nil {
		log.WithField("error", err.Error()).Errorf("failed to get new bitcoin currency")
		return
	}
	cur.raw = string(body)
	cur.btc = btc
	for key, _ := range cur.currencies {
		if key == "BTC" {
			cur.currencies[key] = cur.btc
			continue
		}
		cur.currencies[key] = gjson.Get(cur.raw, fmt.Sprintf("rates.%s", key)).Float()
	}
}

func getBtcCurrency() (float64, error) {
	resp, err := http.Get(btcHost)
	if err != nil || resp.StatusCode != http.StatusOK {
		return 0, ErrFailedToConnectToServer
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, ErrDecodeBody
	}
	return strconv.ParseFloat(string(body), 64)
}

func getCurrencies() ([]byte, error) {
	resp, err := http.Get(host)
	if err != nil || resp.StatusCode != http.StatusOK {
		return nil, ErrFailedToConnectToServer
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, ErrDecodeBody
	}
	return body, nil
}
