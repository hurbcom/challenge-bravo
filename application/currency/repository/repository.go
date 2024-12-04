package repository

import "strings"

type ResponseList struct {
	Currencies []*Currency `json:"currencies"`
}

type Repository interface {
	GetByID(id *string) (*Currency, error)
	List() (*ResponseList, error)
	Create(code, name, currency_rate string, backing_currency bool) (*Currency, error)
	Update(id, code, name, currency_rate string, backing_currency bool) (*Currency, error)
	Delete(id *string) error
	GetByCodes(codes []string) (*ResponseList, error)
}

func notEmpty(s string) bool {
	return strings.TrimSpace(s) != ""
}
