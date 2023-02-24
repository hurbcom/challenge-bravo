package cache

import (
	"fmt"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
)

type ExchangeRate struct{}

func NewExchangeRate() cache.ExchangeRate {
	return &ExchangeRate{}
}

func (cacheExchangeRate *ExchangeRate) Set(key, value string) error {
	key = cacheExchangeRate.keyFormatted(key)

	durationExchangeRate, err := time.ParseDuration("24h")

	if err != nil {
		return err
	}

	return client.Set(ctx, key, value, durationExchangeRate).Err()
}

func (cacheExchangeRate *ExchangeRate) Get(key string) (string, error) {
	key = cacheExchangeRate.keyFormatted(key)
	return client.Get(ctx, key).Result()
}

func (*ExchangeRate) keyFormatted(fieldValue string) string {
	return fmt.Sprintf("%v:%v", "exchange_rate", fieldValue)
}
