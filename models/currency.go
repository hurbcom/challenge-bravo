package models

import (
	"errors"

	"gorm.io/gorm"
)

type Currency struct {
	gorm.Model

	Code string `gorm:"unique"`
	IsReal bool
	ExchangeRate float64
}

func ValidateStoreCurrency(currency *Currency) error {
	if currency.Code == "" {
		return errors.New("The field code is required.")
	}

	if currency.IsReal == false && currency.ExchangeRate == 0 {
		return errors.New("The field ExchangeRate is required when is created a fictional currency.")
	}

	return nil
}