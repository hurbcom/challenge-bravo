package models

import (
	"time"
)

type Currency struct {
	ID             int       `json:"id" db:"id"`
	Key            string    `json:"key" db:"key"`
	Description    string    `json:"description" db:"description"`
	ExchangeApi    bool      `json:"exchangeApi" db:"exchange_api"`
	CustomAmount   float32   `json:"customAmount" db:"custom_amount"`
	CustomCurrency string    `json:"customCurrency" db:"custom_currency"`
	CreatedAt      time.Time `json:"createdAt" db:"created_at"`
}

func (currency *Currency) IsValid() bool {
	if currency.Key == "" || currency.Description == "" {
		return false
	}
	return true
}
