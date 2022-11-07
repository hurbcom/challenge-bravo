package services_test

import (
	"errors"
	"testing"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	mock_repositories "github.com/victorananias/challenge-bravo/repositories/mocks"
	"github.com/victorananias/challenge-bravo/services"
	mock_services "github.com/victorananias/challenge-bravo/services/mocks"
	// mock_services "github.com/victorananias/challenge-bravo/services/mocks"
)

func TestGetCurrencyShouldSupportBackingCurrency(t *testing.T) {
	backingCurrencyCode := "USD"
	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
	}

	result, err := service.GetCurrency(backingCurrencyCode)
	if err != nil {
		t.Errorf("go error %s", err)
	}
	if result.Value != 1 || result.BackingCurrencyCode != backingCurrencyCode || result.Code != backingCurrencyCode {
		t.Error("wrong currency returned from GetCurrency")
	}
}

func TestGetCurrencyShouldReturnWhenUpdated(t *testing.T) {
	backingCurrencyCode := "USD"
	today := time.Now()
	currency := models.Currency{
		Code:                "BRL",
		Value:               2,
		BackingCurrencyCode: backingCurrencyCode,
		UpdatedAt:           today,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	currenciesRepositoryMock := mock_repositories.NewMockICurrenciesRepository(ctrl)

	currenciesRepositoryMock.
		EXPECT().
		GetCurrency(currency.Code, currency.BackingCurrencyCode).
		Return(currency, nil)

	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
		Repository:          currenciesRepositoryMock,
	}

	r, err := service.GetCurrency(currency.Code)

	if err != nil {
		t.Error(err)
	}
	if !r.UpdatedAt.Equal(today) {
		t.Errorf("UpdatedAt expected %v got %v", today, r.UpdatedAt)
	}
	currencyEquals(t, r, currency)
}

func TestGetCurrencyShouldUpdateWhenNotUpdated(t *testing.T) {
	backingCurrencyCode := "USD"
	yesterday := time.Now().AddDate(0, 0, -1)
	today := time.Now()
	yesterdayCurrency := models.Currency{
		Code:                "BRL",
		Value:               2,
		BackingCurrencyCode: backingCurrencyCode,
		UpdatedAt:           yesterday,
	}
	todayCurrency := models.Currency{
		Code:                "BRL",
		Value:               3,
		BackingCurrencyCode: backingCurrencyCode,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	currenciesRepositoryMock := mock_repositories.NewMockICurrenciesRepository(ctrl)
	exchangeApiServiceMock := mock_services.NewMockIExchangeApiService(ctrl)

	currenciesRepositoryMock.
		EXPECT().
		GetCurrency(yesterdayCurrency.Code, yesterdayCurrency.BackingCurrencyCode).
		Return(yesterdayCurrency, nil)

	currenciesRepositoryMock.
		EXPECT().
		CreateOrUpdate(todayCurrency).
		Return(nil)

	exchangeApiServiceMock.
		EXPECT().
		CurrentValue(yesterdayCurrency.Code, yesterdayCurrency.BackingCurrencyCode).
		Return(todayCurrency, nil)

	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
		Repository:          currenciesRepositoryMock,
		ExchangeApiService:  exchangeApiServiceMock,
	}

	result, err := service.GetCurrency(yesterdayCurrency.Code)

	if err != nil {
		t.Error(err)
	}

	if result.UpdatedAt.Year() == today.Year() &&
		result.UpdatedAt.YearDay() == today.YearDay() &&
		result.UpdatedAt.Year() == today.Year() &&
		result.UpdatedAt.Hour() == today.Hour() {
		t.Errorf("UpdatedAt expected %v got %v", today, result.UpdatedAt)
	}

	currencyEquals(t, result, todayCurrency)
}

func TestGetCurrencyShouldCreateWhenNotInDb(t *testing.T) {
	backingCurrencyCode := "USD"
	currency := models.Currency{
		Code:                "BRL",
		Value:               2,
		BackingCurrencyCode: backingCurrencyCode,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	currenciesRepositoryMock := mock_repositories.NewMockICurrenciesRepository(ctrl)
	exchangeApiServiceMock := mock_services.NewMockIExchangeApiService(ctrl)

	currenciesRepositoryMock.
		EXPECT().
		GetCurrency(currency.Code, currency.BackingCurrencyCode).
		Return(models.Currency{}, repositories.ErrNoDocumentFound)

	currenciesRepositoryMock.
		EXPECT().
		CreateOrUpdate(currency).
		Return(nil)

	exchangeApiServiceMock.
		EXPECT().
		CurrentValue(currency.Code, currency.BackingCurrencyCode).
		Return(currency, nil)

	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
		Repository:          currenciesRepositoryMock,
		ExchangeApiService:  exchangeApiServiceMock,
	}

	result, err := service.GetCurrency(currency.Code)

	if err != nil {
		t.Error(err)
	}

	currencyEquals(t, result, currency)
}

func TestGetCurrencyShouldReturnErrorWhenDoesntExist(t *testing.T) {
	backingCurrencyCode := "A"
	currency1 := models.Currency{
		Code:                "B",
		BackingCurrencyCode: backingCurrencyCode,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	currenciesRepositoryMock := mock_repositories.NewMockICurrenciesRepository(ctrl)
	exchangeApiServiceMock := mock_services.NewMockIExchangeApiService(ctrl)

	currenciesRepositoryMock.
		EXPECT().
		GetCurrency(currency1.Code, currency1.BackingCurrencyCode).
		Return(models.Currency{}, repositories.ErrNoDocumentFound)

	exchangeApiServiceMock.
		EXPECT().
		CurrentValue(currency1.Code, currency1.BackingCurrencyCode).
		Return(models.Currency{}, services.ErrCurrencyUnavailable)

	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
		Repository:          currenciesRepositoryMock,
		ExchangeApiService:  exchangeApiServiceMock,
	}

	_, err := service.GetCurrency(currency1.Code)

	if !errors.Is(err, services.ErrCurrencyUnavailable) {
		t.Errorf("err expected %v got %v", services.ErrCurrencyUnavailable, err)
	}
}

func TestConvertFromCurrencies(t *testing.T) {
	var amount float64 = 20
	var expected float64 = 10
	backingCurrencyCode := "USD"
	sourceCurrency := models.Currency{
		Code:                "EUR",
		Value:               2,
		BackingCurrencyCode: backingCurrencyCode,
	}
	targetCurrency := models.Currency{
		Code:                "ETH",
		Value:               4,
		BackingCurrencyCode: backingCurrencyCode,
	}
	service := services.CurrenciesService{
		BackingCurrencyCode: backingCurrencyCode,
	}

	result := service.ConvertFromCurrencies(amount, sourceCurrency, targetCurrency)

	if result != expected {
		t.Errorf("result expected %v got %v", expected, result)
	}
}

func currencyEquals(t *testing.T, currency, expectedCurrency models.Currency) {
	if currency.Code != expectedCurrency.Code {
		t.Errorf("Code: expected %v got %v", expectedCurrency.Code, currency.Code)
	}
	if currency.Value != expectedCurrency.Value {
		t.Errorf("Value: expected %v got %v", expectedCurrency.Value, currency.Value)
	}
	if currency.BackingCurrencyCode != expectedCurrency.BackingCurrencyCode {
		t.Errorf("BackingCurrencyCode: expected %v got %v", expectedCurrency.BackingCurrencyCode, currency.BackingCurrencyCode)
	}
}
