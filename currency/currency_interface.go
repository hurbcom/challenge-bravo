package currency

type Currency interface {
	AddCurrency(initials string) error
	DeleteCurrency(initials string)
	Currency(initials string) (float64, error)
}
