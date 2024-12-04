package currency

import (
	"testing"

	"github.com/danielmalka/challenge-bravo/application/currency/repository"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) GetByID(id *string) (*repository.Currency, error) {
	args := m.Called(id)
	return args.Get(0).(*repository.Currency), args.Error(1)
}

func (m *MockRepository) List() (*repository.ResponseList, error) {
	args := m.Called()
	return args.Get(0).(*repository.ResponseList), args.Error(1)
}

func (m *MockRepository) Create(code, name, currencyRate string, backingCurrency bool) (*repository.Currency, error) {
	args := m.Called(code, name, currencyRate, backingCurrency)
	return args.Get(0).(*repository.Currency), args.Error(1)
}

func (m *MockRepository) Update(id, code, name, currencyRate string, backingCurrency bool) (*repository.Currency, error) {
	args := m.Called(id, code, name, currencyRate, backingCurrency)
	return args.Get(0).(*repository.Currency), args.Error(1)
}

func (m *MockRepository) Delete(id *string) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockRepository) GetByCodes(codes []string) (*repository.ResponseList, error) {
	args := m.Called(codes)
	return args.Get(0).(*repository.ResponseList), args.Error(1)
}

func TestService_Get(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	mockCurrency := &repository.Currency{ID: 1, Code: "USD", Name: "US Dollar"}
	mockRepo.On("GetByID", mock.AnythingOfType("*string")).Return(mockCurrency, nil)

	currency, err := service.Get("1")
	assert.NoError(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, "USD", currency.Code)
}

func TestService_List(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	mockCurrencyList := &repository.ResponseList{Currencies: []*repository.Currency{
		{ID: 1, Code: "USD", Name: "US Dollar"},
	}}
	mockRepo.On("List").Return(mockCurrencyList, nil)

	currencies, err := service.List()
	assert.NoError(t, err)
	assert.NotNil(t, currencies)
	assert.Equal(t, 1, len(currencies))
	assert.Equal(t, "USD", currencies[0].Code)
}

func TestService_Create(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	createData := &CreateData{Code: "USD", Name: "US Dollar", CurrencyRate: "1.0", BackingCurrency: true}
	mockCurrency := &repository.Currency{ID: 1, Code: "USD", Name: "US Dollar"}
	mockRepo.On("Create", createData.Code, createData.Name, createData.CurrencyRate, createData.BackingCurrency).Return(mockCurrency, nil)

	currency, err := service.Create(createData)
	assert.NoError(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, "USD", currency.Code)
}

func TestService_Update(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	updateData := &UpdateData{ID: "1", Code: "USD", Name: "US Dollar", CurrencyRate:" 1.0", BackingCurrency: true}
	mockCurrency := &repository.Currency{ID: 1, Code: "USD", Name: "US Dollar"}
	mockRepo.On("Update", updateData.ID, updateData.Code, updateData.Name, updateData.CurrencyRate, updateData.BackingCurrency).Return(mockCurrency, nil)

	currency, err := service.Update(updateData)
	assert.NoError(t, err)
	assert.NotNil(t, currency)
	assert.Equal(t, "USD", currency.Code)
}

func TestService_Delete(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	mockRepo.On("Delete", mock.AnythingOfType("*string")).Return(nil)

	err := service.Delete("1")
	assert.NoError(t, err)
}

func TestService_GetByCodes(t *testing.T) {
	mockRepo := new(MockRepository)
	service := &Service{repo: mockRepo}

	mockCurrencyList := &repository.ResponseList{Currencies: []*repository.Currency{
		{ID: 1, Code: "USD", Name: "US Dollar"},
	}}
	mockRepo.On("GetByCodes", mock.AnythingOfType("[]string")).Return(mockCurrencyList, nil)

	currencies, err := service.GetByCodes("USD")
	assert.NoError(t, err)
	assert.NotNil(t, currencies)
	assert.Equal(t, 1, len(currencies))
	assert.Equal(t, "USD", currencies[0].Code)
}
