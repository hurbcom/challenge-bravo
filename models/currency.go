package models

import (
	"time"
)

type Currency struct {
	Code                string
	Value               float64
	BackingCurrencyCode string
	UpdatedAt           time.Time
}

func (currency *Currency) UpdatedAtString() string {
	return currency.UpdatedAt.Format("2006-01-02 15:04:05")
}

func (currency *Currency) IsUpdated() bool {
	today := time.Now()
	return currency.UpdatedAt.Year() == today.Year() &&
		currency.UpdatedAt.YearDay() == today.YearDay()
}
