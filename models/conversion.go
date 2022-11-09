package models

import (
	"time"
)

type Conversion struct {
	ID        int       `json:"id" db:"id"`
	From      string    `json:"from" db:"from"`
	To        string    `json:"to" db:"to"`
	Amount    float32   `json:"amount"  db:"amount"`
	Result    float32   `json:"result" db:"result"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

func (currency *Conversion) IsValid() bool {
	if currency.From == "" || currency.To == "" || currency.Amount < 0 || currency.Result < 0 {
		return false
	}
	return true
}
