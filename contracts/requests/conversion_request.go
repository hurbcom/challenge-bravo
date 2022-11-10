package requests

type ConversionRequest struct {
	From  string  `json:"from"`
	To    string  `json:"to"`
	Value float32 `json:"value"`
}
