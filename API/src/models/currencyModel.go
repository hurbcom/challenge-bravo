package models

import "time"

type Currency struct {
	Name            string    `json:"name"`
	ConversionRate  float64   `json:"conversionRate"`
	LastUpdated     time.Time `json:"lastUpdated,omitempty"`
	IsAutoUpdatable bool      `json:"isAutoUpdatable"`
}
