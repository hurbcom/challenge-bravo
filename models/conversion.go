package models

import (
	"time"
)

type Conversion struct {
	ID        uint    `gorm:"primaryKey"`
	From      string  `json:"from"`
	To        string  `json:"to"`
	Amount    float32 `json:"amount"`
	Result    float32 `json:"result"`
	CreatedAt time.Time
}

func (currency *Conversion) IsValid() bool {
	if currency.From == "" || currency.To == "" || currency.Amount < 0 || currency.Result < 0 {
		return false
	}
	return true
}
