package models

import "gorm.io/gorm"

type Currency struct {
	gorm.Model
	Key           string `json:"key"`
	Description   string `json:"description"`
	Enabled       string `json:"enabled"`
	QuotationType string `json:"quotationType"`
}
