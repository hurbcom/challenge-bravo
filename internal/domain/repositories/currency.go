package repositories

import (
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
)

type CurrencyRepository interface {
	CreateCurrency(currency *entity.Currency) (*entity.Currency, error)
	GetCurrencyByName(name string) (*entity.Currency, error)
	DeleteCurrency(name string) error
}
