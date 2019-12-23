package currency

import "challenge-bravo/conversion-api/models"

//Gateway is a interface to catch external sources for currency
type Gateway interface {
	GetCurrencyByName(currency string) (models.Currency, error)
}
