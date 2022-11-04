package models

import "gorm.io/gorm"

type Conversion struct {
	gorm.Model
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float32 `json:"amount"`
	Result float32 `json:"result"`
}
