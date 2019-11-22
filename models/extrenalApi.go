package models

import "time"

//VerifyCoin only resive the status and put all the data on a interface
type VerifyCoin struct {
	Status Status      `json:"status"`
	Data   interface{} `json:"data"`
}

//ResultCoinRequest struct to handle the request of yhe external api
type ResultCoinRequest struct {
	Status Status `json:"status"`
	Data   Data   `json:"data"`
}

//Status show the status o the currency
type Status struct {
	Timestamp    time.Time   `json:"timestamp"`
	ErrorCode    int         `json:"error_code"`
	ErrorMessage interface{} `json:"error_message"`
	Elapsed      int         `json:"elapsed"`
	CreditCount  int         `json:"credit_count"`
	Notice       interface{} `json:"notice"`
}

//Data referenc of the dollar stuct
type Data struct {
	Dollar Dollar `json:"2781"`
}

//Dollar represent the default dollar stuct to recive the price of the ref coin
type Dollar struct {
	ID                int                `json:"id"`
	Name              string             `json:"name"`
	Symbol            string             `json:"symbol"`
	Slug              string             `json:"slug"`
	NumMarketPairs    int                `json:"num_market_pairs"`
	DateAdded         time.Time          `json:"date_added"`
	Tags              []string           `json:"tags"`
	MaxSupply         int                `json:"max_supply"`
	CirculatingSupply int                `json:"circulating_supply"`
	TotalSupply       int                `json:"total_supply"`
	Platform          interface{}        `json:"platform"`
	CmcRank           int                `json:"cmc_rank"`
	LastUpdated       time.Time          `json:"last_updated"`
	Quote             map[string]RefCoin `json:"quote"`
}

//RefCoin struct represents the coin to be Converted
type RefCoin struct {
	Price            float64   `json:"price"`
	Volume24H        float64   `json:"volume_24h"`
	PercentChange1H  float64   `json:"percent_change_1h"`
	PercentChange24H float64   `json:"percent_change_24h"`
	PercentChange7D  float64   `json:"percent_change_7d"`
	MarketCap        float64   `json:"market_cap"`
	LastUpdated      time.Time `json:"last_updated"`
}
