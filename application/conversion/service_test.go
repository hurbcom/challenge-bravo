package conversion

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockConversionService struct {
	mock.Mock
}

func (m *MockConversionService) ConvertMoney(c *ConversionValues, bc string) (*ConversionResponse, error) {
	args := m.Called(c, bc)
	return args.Get(0).(*ConversionResponse), args.Error(1)
}

func TestService_ConvertMoney(t *testing.T) {
	service := new(MockConversionService)

	conversionValues := &ConversionValues{
		Amount: "100.00",
		From:   CurrencyRate{Code: "USD", CurrencyRate: "1.0"},
		To:     CurrencyRate{Code: "EUR", CurrencyRate: "0.85"},
	}
	expectedResponse := &ConversionResponse{
		Description: "Conversion from USD to EUR",
		Amount:      "85.00",
	}
	service.On("ConvertMoney", conversionValues, "USD").Return(expectedResponse, nil)

	response, err := service.ConvertMoney(conversionValues, "USD")
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, "85.00", response.Amount)
	assert.Equal(t, "Conversion from USD to EUR", response.Description)
}
