package models

import (
	"time"
)

type Rate struct {
	ObjectId            string
	Code                string
	Value               float64
	BackingCurrencyCode string
	UpdatedAt           time.Time
}

func (rate *Rate) UpdatedAtString() string {
	return rate.UpdatedAt.Format("2006-01-02 15:04:05")
}
