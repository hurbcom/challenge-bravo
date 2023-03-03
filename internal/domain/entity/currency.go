package entity

type Currency struct {
	Name string  `json:"name"`
	Rate float64 `json:"rate"`
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
