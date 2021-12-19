package models

import (
	"github.com/shopspring/decimal"
)

/* External API data */
type ExternalApiRates struct {
	Data  map[string]decimal.Decimal `json:"data"`
	Query struct {
		Timestamp int64 `json:"timestamp"`
	} `json:"query"`
}
