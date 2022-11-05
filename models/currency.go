package models

import "gorm.io/gorm"

type Currency struct {
	gorm.Model
	Key           string `json:"key"`
	Description   string `json:"description"`
	QuotationType string `json:"quotationType"`
}
