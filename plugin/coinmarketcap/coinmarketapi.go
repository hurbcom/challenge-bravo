package coinmarket

//RatesResponse is the structure that holds the response in a
//currency rate request by CoinMarketCap API
type RatesResponse struct {
	Status status          `json:"status"`
	Data   map[string]data `json:"data"`
}

type status struct {
	Timestamp    string `json:"timestamp"`
	ErrorCode    int    `json:"error_code"`
	ErrorMessage string `json:"error_message"`
}

type data struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Symbol string `json:"symbol"`
	Quote  quote  `json:"quote"`
}

type quote struct {
	USD usd `json:"USD"`
}

type usd struct {
	Price float64 `json:"price"`
}

//Caller is the generic request caller
type Caller interface {
	CallAPI(method, path string, formValues map[string]string) ([]byte, error)
}
