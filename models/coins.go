package models

import (
	"errors"
	"strings"
	"time"

	"github.com/hurbcom/challenge-bravo/utils"
)

var SuportedCoins []string

func addCoin() {

}

func removeCoin() error {
	if len(SuportedCoins) > 0 {

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

//Response
type Response struct {
	Status struct {
		Timestamp    time.Time   `json:"timestamp"`
		ErrorCode    int         `json:"error_code"`
		ErrorMessage interface{} `json:"error_message"`
		Elapsed      int         `json:"elapsed"`
		CreditCount  int         `json:"credit_count"`
		Notice       interface{} `json:"notice"`
	} `json:"status"`
	Data struct {
		ID          int              `json:"id"`
		Symbol      string           `json:"symbol"`
		Name        string           `json:"name"`
		Amount      float64          `json:"amount"`
		LastUpdated time.Time        `json:"last_updated"`
		Quote       map[string]Quote `json:"quote"`
	} `json:"data"`
}

type Quote struct {
	Price       float64   `json:"price"`
	LastUpdated time.Time `json:"last_updated"`
}
