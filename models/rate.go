package models

import "time"

type Rate struct {
	ObjectId            string
	Code                string
	Value               float64
	BackingCurrencyCode string
	UpdatedAt           time.Time
}
