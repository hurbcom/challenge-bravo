package models

// Conversion is a model for conversion
type Conversion struct {
	From *Currency
	To   *Currency
}

// NewConversion creates a new conversion
func NewConversion() *Conversion {
	return &Conversion{
		From: new(Currency),
		To:   new(Currency),
	}
}
