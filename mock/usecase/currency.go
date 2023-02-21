package mock_usecase

import (
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/stretchr/testify/mock"
)

type MockCurrency struct {
	mock.Mock
}

func (mockCurrency *MockCurrency) Insert(currencyModel *model.Currency) (*model.Currency, error) {
	args := mockCurrency.Called()
	currencySource := *args.Get(0).(*model.Currency)
	currencyResult := currencySource

	currencyResult.ID = 1
	currencyResult.CreatedAt = time.Now().UTC()

	return &currencyResult, args.Error(1)
}

func (mockCurrency *MockCurrency) GetByID(id int64) (*model.Currency, error) {
	return &model.Currency{}, nil
}
