package models

import (
	"errors"
	"strings"

	"github.com/hurbcom/challenge-bravo/utils"
)

var SuportedCoins []string

//Coin
type Coin struct {
	Symbol string `json:"symbol"`
}

func (c *Coin) AddCoin() {
	SuportedCoins = append(SuportedCoins, strings.ToUpper(c.Symbol))
	return
}

func (c *Coin) StoreContains() bool {
	return utils.Contains(SuportedCoins, strings.ToUpper(c.Symbol))
}

func (c *Coin) DeleteCoin() error {
	if len(SuportedCoins) > 0 {
		if utils.Contains(SuportedCoins, strings.ToUpper(c.Symbol)) {
			for i, val := range SuportedCoins {
				if strings.ToUpper(c.Symbol) == val {
					utils.RemoveCopy(SuportedCoins, i)
					return nil
				}
			}
		}
		return errors.New("Is not possible delete this coin")
	}
	return nil
}

func GetSuportedCoins() []string {
	return SuportedCoins
}

//CoinExchange
type CoinExchange struct {
	From            string           `json:"from"`
	To              string           `json:"to"`
	Amount          float64          `json:"amount"`
	Priceconversion map[string]Quote `json:"price_conversion"`
}

//ValidateAmount this validation is to view if the coin is suported
func (c *CoinExchange) ValidateCoin() error {
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
