package currency

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"time"
)

const host = `https://api.exchangeratesapi.io/latest?base=USD`

type currency struct {
	raw string
}

func NewCurrency() (Currency, error) {
	body, err := getCurrencies()
	if err != nil {
		return nil, err
	}
	cur := &currency{raw: string(body)}
	go func() {
		for {
			<-time.Tick(time.Minute)
			body, err = getCurrencies()
			if err != nil {
				log.WithFields(log.Fields{"error": err.Error()}).Errorf("failed to get new currencies")
				continue
			}
			cur.raw = string(body)
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
	price, _ := c.Extra("BTC")
	return price
}

func (c *currency) ETH() float64 {
	price, _ := c.Extra("ETH")
	return price
}

func (c *currency) Extra(initials string) (float64, error) {
	result := gjson.Get(c.raw, fmt.Sprintf("rates.%s", initials))
	if !result.Exists() {
		return 0, ErrCurrencyNotExist
	}
	return result.Float(), nil
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
