package models

import "time"

type Currency struct {
	Code                string
	Value               float32
	BackingCurrencyCode string
	UpdatedAt           time.Time
}
