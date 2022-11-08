package entities

import "gorm.io/gorm"

type Conversion struct {
	gorm.Model
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float32 `json:"amount"`
	Result float32 `json:"result"`
}

func (currency *Conversion) IsValid() bool {
	if currency.From == "" || currency.To == "" || currency.Amount <= 0 || currency.Result <= 0 {
		return false
	}
	return true
}
