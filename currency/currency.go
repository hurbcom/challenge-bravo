package currency

// This package provides currency price conversion using a ballast currency
// USD is going to be used as ballast currency here

// Price is a data structure that encapsulates a hash table which maps currency symbol
// to its price in a ballast currency.
// This encapsulation gives flexibility to change inner data structure later if necessary
type Price struct {
	data Quotes
}

// Quotes is the inner data structure
type Quotes map[string]float64

// NewPrice returns a new instace of Price
func NewPrice(quotes Quotes) *Price {
	if quotes == nil {
		quotes = make(Quotes)
	}
	return &Price{data: quotes}
}

// Convert converts and amount of a "from" currency to a "to" one
func (p *Price) Convert(from, to string, amount float64) float64 {
	priceFrom := p.data[from]
	priceTo := p.data[to]
	fromInBallast := amount / priceFrom
	return priceTo * fromInBallast
}

// Save stores a price of a symbol
func (p *Price) Save(symbol string, price float64) {
	p.data[symbol] = price
}
