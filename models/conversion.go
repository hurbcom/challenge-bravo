package models

// Represent the structure of Conversion, used at operation conversion two currencies
type Conversion struct {
	Amount float64 `uri:"amount" binding:"required"`
	From   string  `uri:"from" binding:"required"`
	To     string  `uri:"to" binding:"required"`
}
