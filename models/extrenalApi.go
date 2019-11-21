package models

import "time"

//Response
type Response struct {
	Status Status `json:"status"`
	Data   struct {
		ID          int              `json:"id"`
		Symbol      string           `json:"symbol"`
		Name        string           `json:"name"`
		Amount      float64          `json:"amount"`
		LastUpdated time.Time        `json:"last_updated"`
		Quote       map[string]Quote `json:"quote"`
	} `json:"data"`
}

//Quote models
type Quote struct {
	Price       float64   `json:"price"`
	LastUpdated time.Time `json:"last_updated"`
}

//Status
type Status struct {
	Timestamp    time.Time   `json:"timestamp"`
	ErrorCode    int         `json:"error_code"`
	ErrorMessage interface{} `json:"error_message"`
	Elapsed      int         `json:"elapsed"`
	CreditCount  int         `json:"credit_count"`
	Notice       interface{} `json:"notice"`
}

//VerifyCoin
type VerifyCoin struct {
	Status Status      `json:"status"`
	Data   interface{} `json:"data"`
}
