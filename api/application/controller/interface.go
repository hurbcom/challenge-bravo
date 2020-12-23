package controller

type Controller interface {
	AddCurrency(code string) error
	RemoveCurrency(code string) error
	ConvertCurrency(from, to string, amount float64) (float64, error)
}
