package models

import (
	"time"

	"gorm.io/gorm"
)

type Currency struct {
	ID            uint   `gorm:"primaryKey"`
	Key           string `gorm:"size:255;index:idx_currency_key,unique" json:"key"`
	Description   string `gorm:"size:255" json:"description"`
	QuotationType string `gorm:"default:exchange_api" json:"quotationType"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
}

func (currency *Currency) IsValid() bool {
	if currency.Key == "" || currency.Description == "" {
		return false
	}
	return true
}
