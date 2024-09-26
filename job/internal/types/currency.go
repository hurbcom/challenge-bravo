package types

import "time"

type Currency struct {
	CreatedAt          time.Time
	UpdatedAt          time.Time
	CountryCode        *string
	Number             *int
	SearchURL          *string
	ResponsePathToRate *string
	Fic                *bool
	Country            *string
	Name               string
	Code               string
	USDExchangeRate    float64
	ID                 int
	CreatedBy          int
	UpdatedBy          int
}
