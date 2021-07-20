package models

import (
	"errors"

	"gorm.io/gorm"
)

type Currency struct {
	gorm.Model

	Code string `gorm:"unique" uri:"code" binding:"required"`
	IsReal bool
	ExchangeRate float64
}

func ValidateStoreCurrency(currency *Currency) error {

	if currency.IsReal == false && currency.ExchangeRate == 0 {
		return errors.New("The field ExchangeRate is required when is created a fictional currency.")
	}

	return nil
}