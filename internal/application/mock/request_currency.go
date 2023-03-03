package mock

import (
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
)

type RequestCurrencyMock struct{}

func NewRequestCurrencyMock() *RequestCurrencyMock {
	return &RequestCurrencyMock{}
}

func (request *RequestCurrencyMock) GetCurrency(name string) (*entity.Currency, error) {
	return &entity.Currency{
		Name: name,
		Rate: 1,
	}, nil
}
