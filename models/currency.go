package models

import (
	"gorm.io/gorm"
)

type Currency struct {
	gorm.Model

	Code string `gorm:"unique"`
	IsReal bool
	ExchangeRate float64
}
