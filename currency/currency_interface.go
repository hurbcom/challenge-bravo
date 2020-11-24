package currency

type Currency interface {
	USD() float64
	BRL() float64
	EUR() float64
	BTC() float64
	ETH() float64
	Extra(initials string) (float64, error)
}
