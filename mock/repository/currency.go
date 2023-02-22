package mock_repository

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

	currencyModel = args.Get(0).(*model.Currency)
	accountInserted := *currencyModel

	accountInserted.ID = 1
	accountInserted.CreatedAt = time.Now().UTC()

	return &accountInserted, args.Error(1)
}

// TODO: to implement
func (mockCurrency *MockCurrency) GetByID(id int64) (*model.Currency, error) {
	return nil, nil
}

// TODO: to implement
func (mockCurrency *MockCurrency) List() (*model.Currencies, error) {
	return nil, nil
}

// TODO: to implement
func (mockCurrency *MockCurrency) Update(currencyModel *model.Currency) (*model.Currency, error) {
	return nil, nil
}

// TODO: to implement
func (mockCurrency *MockCurrency) Delete(id int64) error {
	return nil
}

// TODO: to implement
func (mockCurrency *MockCurrency) GetByShortName(shortName string) (*model.Currency, error) {
	return nil, nil
}
