package mock_cache

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/stretchr/testify/mock"
)

type MockCurrency struct {
	mock.Mock
}

func (mockCurrency *MockCurrency) SetByShortName(currencyModel *model.Currency) error {
	args := mockCurrency.Called()

	currencyModel = args.Get(0).(*model.Currency)

	return args.Error(1)
}

func (mockCurrency *MockCurrency) GetByShortName(shortName string) (*model.Currency, error) {
	args := mockCurrency.Called()

	currencyModel := args.Get(0).(*model.Currency)

	return currencyModel, args.Error(1)
}
func (mockCurrency *MockCurrency) DelByShortName(shortName string) error {
	args := mockCurrency.Called()

	return args.Error(0)
}
