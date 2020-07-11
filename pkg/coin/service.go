package coin

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
)

const (
	USD = "USD"
	BRL = "BRL"
	EUR = "EUR"
	BTC = "BTC"
	ETH = "ETH"
)

type Service interface {
	ConvertCoin(from Coin, to string) (*Coin, error)
}

func isCryptoCoin(coin string) bool {
	return coin == BTC || coin == ETH
}

func convertFromCryptoCoin(from Coin, to string) (*Coin, error) {
	return nil, nil
}

func convertFromPaperCoin(from Coin, to string) (*Coin, error) {
	u, err := url.Parse(fmt.Sprintf("https://api.exchangeratesapi.io/latest?base=%s", from.Name))
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return nil, err
	}

	var body RepositoryData
	if err = json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	log.Println(body.Rates, body.Date)

	return &Coin{Name: USD, Amount: 1}, nil
}

type DefaultService struct{}

func (_ *DefaultService) ConvertCoin(from Coin, to string) (*Coin, error) {
	if isCryptoCoin(from.Name) {
		return convertFromCryptoCoin(from, to)
	}

	return convertFromPaperCoin(from, to)
}
