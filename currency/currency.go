// Package currency provides currency price conversion using a ballast currency
// USD is going to be used as ballast currency here
package currency

import (
	"encoding/json"
	"sync"
)

// Price is a data structure that encapsulates a hash table which maps currency symbol
// to its price in a ballast currency.
// This encapsulation gives flexibility to change inner data structure later if necessary
type Price struct {
	data  Quotes
	mutex *sync.Mutex
}

// Quotes is the inner data structure
type Quotes map[string]float64

// NewPrice returns a new instace of Price
func NewPrice(quotes Quotes) *Price {
	if quotes == nil {
		quotes = make(Quotes)
	}
	return &Price{
		data:  quotes,
		mutex: &sync.Mutex{},
	}
}

// Convert converts and amount of a "from" currency to a "to" one
func (p *Price) Convert(from, to string, amount float64) float64 {
	p.mutex.Lock()
	priceFrom := p.data[from]
	priceTo := p.data[to]
	p.mutex.Unlock()
	if priceFrom == 0 {
		return 0
	}
	fromInBallast := amount / priceFrom
	return priceTo * fromInBallast
}

// Save stores a price of a symbol
func (p *Price) Save(symbol string, price float64) {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	p.data[symbol] = price
}

// Get retrieves price of a currency
func (p *Price) Get(symbol string) (float64, bool) {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	if value, ok := p.data[symbol]; ok {
		return value, true
	}
	return 0, false
}

// InvertPrice inverts the price of one currency by the other
func InvertPrice(price float64) float64 {
	return 1 / price
}

func (quotes *Quotes) String() string {
	m := map[string]float64(*quotes)
	b, _ := json.Marshal(m)
	return string(b)
}

// String returns JSON string of prices data
func (p *Price) String() string {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	return p.data.String()
}
