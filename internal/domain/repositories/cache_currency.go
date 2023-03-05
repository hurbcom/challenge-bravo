package repositories

import "github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"

type CurrencyCacheRepository interface {
	GetCurrency(name string) *entity.Currency
	CreateCurrency(currency *entity.Currency) bool
	DeleteCurrency(name string) bool
}
