package entities

type Currency struct {
	Key           string `json:"key"`
	Description   string `json:"description"`
	QuotationType string `json:"quotationType"`
}

func (currency *Currency) IsValid() bool {
	if currency.Key == "" || currency.Description == "" {
		return false
	}
	return true
}
