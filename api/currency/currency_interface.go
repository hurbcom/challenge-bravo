package currency

type Currency interface {
	NewCurrency(name string) error
	DeleteCurrency(name string) error
	Convert(convert CurrencyConvert) (*float64, error)
	GetAllCurrencies() map[string]float64
}
