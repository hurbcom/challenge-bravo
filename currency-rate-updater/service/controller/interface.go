package controller

type Controller interface {
	AddCurrency(code string) error
	RemoveCurrency(code string) error
	UpdateCurrencies() error
	GetAllowedCurrencies() []string
}
