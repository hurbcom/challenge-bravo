package client

type Client interface {
	AddCurrency(code string) error
	RemoveCurrency(code string) error
}
