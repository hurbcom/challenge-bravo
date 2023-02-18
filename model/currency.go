package model

import "time"

type Currency struct {
	ID            int64     `json:"id"`
	Currency      string    `json:"currency"`
	RateUSD       float32   `json:"rateUSD"`
	ReferenceDate time.Time `json:"reference_date"`
	CreatedAt     time.Time `json:"created_at"`
}

type Currencies []Currency
