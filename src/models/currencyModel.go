package models

type Currency struct {
	Name            string  `json:"name"`
	ConversionRate  float64 `json:"conversionRate"`
	IsAutoUpdatable bool    `json:"isAutoUpdatable"`
}
