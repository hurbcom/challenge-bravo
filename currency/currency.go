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
	raw string
	btc float64
}

func NewCurrency() (Currency, error) {
	body, err := getCurrencies()
	if err != nil {
		return nil, err
	}
	btc, err := getBtcCurrency()
	if err != nil {
		return nil, err
	}
	cur := &currency{raw: string(body), btc: btc}
	go func() {
		for {
			<-time.Tick(time.Minute)
			body, err = getCurrencies()
			if err != nil {
				log.WithFields(log.Fields{"error": err.Error()}).Errorf("failed to get new currencies")
				continue
			}
			btc, err = getBtcCurrency()
			if err != nil {
				log.WithFields(log.Fields{"error": err.Error()}).Errorf("failed to get new bitcoin currency")
				continue
			}
			cur.raw = string(body)
			cur.btc = btc
		}
	}()
	return cur, nil
}

func (c *currency) USD() float64 {
	price, _ := c.Extra("USD")
	return price
}

func (c *currency) BRL() float64 {
	price, _ := c.Extra("BRL")
	return price
}

func (c *currency) EUR() float64 {
	price, _ := c.Extra("EUR")
	return price
}

func (c *currency) BTC() float64 {
	return c.btc
}

func (c *currency) ETH() float64 {
	price, _ := c.Extra("ETH")
	return price
}

func (c *currency) Extra(initials string) (float64, error) {
	if initials == "BTC" {
		return c.BTC(), nil
	}
	result := gjson.Get(c.raw, fmt.Sprintf("rates.%s", strings.ToUpper(initials)))
	if !result.Exists() {
		return 0, ErrCurrencyNotExist
	}
	return result.Float(), nil
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
