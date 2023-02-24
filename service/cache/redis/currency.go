package cache

import (
	"encoding/json"
	"fmt"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
)

type Currency struct{}

func NewCurrency() cache.Currency {
	return &Currency{}
}

func (cacheCurrency *Currency) SetByShortName(currencyModel *model.Currency) error {
	key := cacheCurrency.keyFormatted("short_name", currencyModel.ShortName)
	value, err := json.Marshal(currencyModel)

	if err != nil {
		return err
	}

	return client.Set(ctx, key, value, expiration).Err()
}

func (cacheCurrency *Currency) GetByShortName(shortName string) (*model.Currency, error) {
	key := cacheCurrency.keyFormatted("short_name", shortName)
	value, err := client.Get(ctx, key).Result()

	if err != nil {
		return nil, err
	}

	currencyModel := &model.Currency{}
	err = json.Unmarshal([]byte(value), currencyModel)

	return currencyModel, err
}

func (cacheCurrency *Currency) DelByShortName(shortName string) error {
	key := cacheCurrency.keyFormatted("short_name", shortName)
	return client.Del(ctx, key).Err()
}

func (*Currency) keyFormatted(fieldName, fieldValue string) string {
	return fmt.Sprintf("%v:%v:%v", "currency", fieldName, fieldValue)
}
