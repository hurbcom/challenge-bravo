package repository

import "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"

type Currency interface {
	Insert(currencyModel *model.Currency) (*model.Currency, error)
	GetByID(id int64) (*model.Currency, error)
	List() (*model.Currencies, error)
	Update(currencyModel *model.Currency) (*model.Currency, error)
	Delete(id int64) error
	GetByShortName(shortName string) (*model.Currency, error)
	UpdateByExchangeRate(currencyExchangeRateModel *model.CurrencyExchangeRate) error
}
