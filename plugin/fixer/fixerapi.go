package fixer

//RatesResponse is the structure that holds the response in a
//currency rate request by FixerAPI
type RatesResponse struct {
	Success   bool               `json:"success"`
	Error     errAPI             `json:"error"`
	Timestamp int                `json:"timestamp"`
	Base      string             `json:"base"`
	Date      string             `json:"date"`
	Rates     map[string]float64 `json:"rates"`
}

type errAPI struct {
	Code int    `json:"code"`
	Type string `json:"type"`
	Info string `json:"info"`
}

//Caller is the generic request caller
type Caller interface {
	CallAPI(method, path string, body []byte) ([]byte, error)
}
