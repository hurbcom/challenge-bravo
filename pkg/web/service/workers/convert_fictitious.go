package workers

import (
	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary"
)

// ConvertFictitious converts between two fictitious currencies or one real and one fictitious currency.
func ConvertFictitious(fromM *monetary.Money, toC monetary.Currency, s *cache.Store[string, *abstract.LiveResponse], apiKey string) (string, error) {
	fromC := fromM.Currency()

	if fromC.Standard == monetary.CurrencyStandardFictitious &&
		toC.Standard == monetary.CurrencyStandardFictitious {

		toUSD := monetary.New(*toC.FixedExchangeRateIntPart, *toC.FixedExchangeRateDecimalPart, toC)
		fromUSD := monetary.New(*fromC.FixedExchangeRateIntPart, *fromC.FixedExchangeRateDecimalPart, fromC)

		val := (toUSD.GetFloat() * fromM.GetFloat()) / fromUSD.GetFloat()
		return getResult(val, toC.MaxUnits), nil
	}

	if fromC.Code == "USD" {
		fromUSD := monetary.New(*toC.FixedExchangeRateIntPart, *toC.FixedExchangeRateDecimalPart, fromC)

		val := fromM.GetFloat() * fromUSD.GetFloat()
		return getResult(val, toC.MaxUnits), nil
	}

	if toC.Code == "USD" {
		toUSD := monetary.New(*fromC.FixedExchangeRateIntPart, *fromC.FixedExchangeRateDecimalPart, toC)

		val := fromM.GetFloat() / toUSD.GetFloat()
		return getResult(val, toC.MaxUnits), nil
	}

	fromToRates, _ := s.Get(fromC.Code)
	toFromRates, _ := s.Get(toC.Code)

	if fromToRates != nil {
		return fromRealToFake(toC, fromC, fromM.GetFloat(), fromToRates.ExchangeRates["USD"]), nil
	}

	if toFromRates != nil {
		return fromFakeToReal(fromC, toC, toFromRates.ExchangeRates["USD"], fromM.GetFloat()), nil
	}

	// slow path
	if fromC.Standard != monetary.CurrencyStandardFictitious {
		res, err := getAndCache(fromC.Code, apiKey, s)
		if err != nil {
			return "", err
		}

		return fromRealToFake(toC, fromC, fromM.GetFloat(), res.ExchangeRates["USD"]), nil
	}

	res, err := getAndCache(toC.Code, apiKey, s)
	if err != nil {
		return "", err
	}

	return fromFakeToReal(fromC, toC, res.ExchangeRates["USD"], fromM.GetFloat()), nil
}

func fromRealToFake(toC, fromC monetary.Currency, amount, rate float64) string {
	fromUSD := monetary.New(*toC.FixedExchangeRateIntPart, *toC.FixedExchangeRateDecimalPart, fromC)
	val := (fromUSD.GetFloat() * amount) / (1 / rate)
	return getResult(val, toC.MaxUnits)
}

func fromFakeToReal(fromC, toC monetary.Currency, rate, amount float64) string {
	toUSD := monetary.New(*fromC.FixedExchangeRateIntPart, *fromC.FixedExchangeRateDecimalPart, toC)
	val := ((1 / rate) * amount) / toUSD.GetFloat()
	return getResult(val, toC.MaxUnits)
}
