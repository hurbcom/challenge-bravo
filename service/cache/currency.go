package cache

import "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"

type Currency interface {
	SetByShortName(currencyModel *model.Currency) error
	GetByShortName(key string) (*model.Currency, error)
}
