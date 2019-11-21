package models

import (
	"errors"
	"strings"

	"github.com/hurbcom/challenge-bravo/utils"
)

var SuportedCoins []string

type Coin struct {
	Symbol string `json:"symbol"`
}

func (c *Coin) AddCoin() {
	SuportedCoins = append(SuportedCoins, c.Symbol)
	return
}

func (c *Coin) StoreContains() bool {
	return utils.Contains(SuportedCoins, c.Symbol)
}

func (c *Coin) DeleteCoin() error {
	if len(SuportedCoins) > 0 {
		if utils.Contains(SuportedCoins, c.Symbol) {
			for i, val := range SuportedCoins {
				if c.Symbol == val {
					utils.RemoveCopy(SuportedCoins, i)
					return nil
				}
			}
		}
		return errors.New("Is not possible delete this coin")
	}
	return nil
}

//CoinExchange
type CoinExchange struct {
	From            string           `json:"from"`
	To              string           `json:"to"`
	Amount          float64          `json:"amount"`
	Priceconversion map[string]Quote `json:"price_conversion"`
}

//ValidateAmount this validation is to view if the coin is suported
func (c *CoinExchange) ValidateAmount() error {
	if ok := utils.Contains(SuportedCoins, c.From); !ok {
		return errors.New("Coin not suported")
	}
	parsedto := strings.Split(c.To, ",")
	for _, str := range parsedto {
		ok := utils.Contains(SuportedCoins, str)
		if !ok {
			return errors.New("Coin not suported")
		}
	}
	return nil
}
