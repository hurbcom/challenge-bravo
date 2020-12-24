package controller

import (
	"errors"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	"github.com/iiurydias/challenge-bravo/api/cache"
)

var ErrFromCurrencyNotFound = errors.New("from currency not found")
var ErrToCurrencyNotFound = errors.New("to currency not found")

type controller struct {
	grpcClient  client.Client
	cacheModule cache.Cache
}

func New(grpcClient client.Client, cacheModule cache.Cache) Controller {
	return &controller{grpcClient: grpcClient, cacheModule: cacheModule}
}

// IT ASKS GRPC CLIENT TO CALL ADD CURRENCY SERVICE
func (c *controller) AddCurrency(code string) error {
	return c.grpcClient.AddCurrency(code)
}

// IT ASKS GRPC CLIENT TO CALL ADD REMOVE SERVICE
func (c *controller) RemoveCurrency(code string) error {
	return c.grpcClient.RemoveCurrency(code)
}

// IT GETS CURRENCIES RATES ON CACHE AND MAKE CONVERSION
func (c *controller) ConvertCurrency(from, to string, amount float64) (float64, error) {
	fromCurrencyRate, err := c.cacheModule.Get(from)
	if err != nil {
		if err == cache.ErrNotFound {
			return 0, ErrFromCurrencyNotFound
		}
		return 0, err
	}
	toCurrencyRate, err := c.cacheModule.Get(to)
	if err != nil {
		if err == cache.ErrNotFound {
			return 0, ErrToCurrencyNotFound
		}
		return 0, err
	}
	return ((1 / fromCurrencyRate) * toCurrencyRate) * amount, nil
}
