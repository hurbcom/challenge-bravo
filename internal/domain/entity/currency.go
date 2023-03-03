package entity

type Currency struct {
	Name string  `bson:"name"`
	Rate float64 `bson:"rate"`
}

type CurrencyStrategy interface {
	GetCurrency(name string) (*Currency, error)
}

func (currency *Currency) IsOfficialCurrency(officialCurrencies []string) bool {
	for _, officialCurrency := range officialCurrencies {
		if currency.Name == officialCurrency {
			return true
		}
	}

	return false
}
