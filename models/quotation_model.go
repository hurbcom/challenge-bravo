package models

type Quotation struct {
	Code       string `json:"code"`
	Codein     string `json:"codein"`
	Name       string `json:"name"`
	Value      string `json:"bid"`
	CreateDate string `json:"create_date"`
}
