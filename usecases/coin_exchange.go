package usecases

// Exchanger is responsible for converting currency one from another
type Exchanger struct{}

// NewExchanger returns a new instance of a exchanger
func NewExchanger() *Exchanger { return &Exchanger{} }

// Exchange converts a currency amount to another currency. baseCoin is the baseCoin currency value in USD, targetCoin is the target currency in USD and amount is the value to be converted
func (e Exchanger) Exchange(baseCoin, targetCoin, amount float64) float64 {
	return baseCoin * amount * targetCoin
}
