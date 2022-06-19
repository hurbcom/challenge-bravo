package models

type Conversion struct {
	From *Currency
	To   *Currency
}

func NewConversion() *Conversion {
	return &Conversion{
		From: new(Currency),
		To:   new(Currency),
	}
}
