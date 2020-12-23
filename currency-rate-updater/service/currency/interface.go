package currency

type Currency interface {
	GetCurrencyRate(code string) (float64, error)
	GetAllCurrenciesRate() (map[string]float64, error)
}
