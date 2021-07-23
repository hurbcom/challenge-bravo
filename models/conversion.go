package models

type Conversion struct {
	Amount float64 `uri:"amount" binding:"required"`
	From   string  `uri:"from" binding:"required"`
	To     string  `uri:"to" binding:"required"`
}
