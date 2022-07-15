package workers

import (
	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary"
)

// ConvertReal makes a convertion between two real currencies.
func ConvertReal(fromM *monetary.Money, toC monetary.Currency, s *cache.Store[string, *abstract.LiveResponse], apiKey string) (string, error) {
	fromC := fromM.Currency()
	fromToRates, _ := s.Get(fromC.Code)
	toFromRates, _ := s.Get(toC.Code)

	if fromToRates != nil {
		val := fromM.GetFloat() * fromToRates.ExchangeRates[toC.Code]
		return getResult(val, toC.MaxUnits), nil
	}

	if toFromRates != nil {
		val := fromM.GetFloat() / toFromRates.ExchangeRates[fromC.Code]
		return getResult(val, toC.MaxUnits), nil
	}

	// slow path
	res, err := getAndCache(fromC.Code, apiKey, s)
	if err != nil {
		return "", err
	}

	val := fromM.GetFloat() * res.ExchangeRates[toC.Code]
	return getResult(val, toC.MaxUnits), nil
}
