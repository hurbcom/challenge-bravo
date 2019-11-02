package models

type Event struct {
	Data struct {
		ID       string `json:"ID"`
		Currency string `json:"Currency"`
		Rate     string `json:"Rate"`
	}
}

type allEvents []Event

var Events = allEvents{
	{
		ID:       "1",
		Currency: "USD",
		Rate:     "1",
	},
	{
		ID:       "2",
		Currency: "BRL",
		Rate:     "0.25",
	},
	{
		ID:       "3",
		Currency: "EUR",
		Rate:     "1,12",
	},
	{
		ID:       "4",
		Currency: "BTC",
		Rate:     "9347.2",
	},
	{
		ID:       "5",
		Currency: "ETH",
		Rate:     "183.91",
	},
}
