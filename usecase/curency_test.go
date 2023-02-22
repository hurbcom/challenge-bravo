package usecase

import (
	"errors"
	"testing"
	"time"

	mock_repository "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/mock/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/stretchr/testify/assert"
)

func TestInsertShortNameEmptyError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The short_name is empty", err.Error())
}

func TestInsertShortNameSizeLessError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		ShortName:     "AA",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The short_name size is not between 3 and 10", err.Error())
}

func TestInsertShortNameSizeGreaterError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		ShortName:     "AAAAAAAAAAA",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The short_name size is not between 3 and 10", err.Error())
}

func TestInsertRateUSDZeroError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       0,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The rate_usd is zero", err.Error())
}

func TestInsertReferenceDateEmptyError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	currency := model.Currency{
		ShortName: "TEST",
		RateUSD:   1.23,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The reference_date is empty", err.Error())
}

func TestInsertReferenceDateBeforeError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1899-12-31")

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "The reference_date value is not between ")
}

func TestInsertReferenceDateAfterError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate := time.Now().UTC().Truncate(24*time.Hour).AddDate(0, 0, 1)

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "The reference_date value is not between ")
}

func TestInsertRepositoryError(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := &model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	errSpected := errors.New("repository error")

	mockRepositoryCurrency.On("Insert").Return(currency, errSpected)

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	_, err := usecaseCurrency.Insert(currency)

	assert.NotNil(t, err)
	assert.Equal(t, errSpected, err)
}

func TestInsertSuccess(t *testing.T) {
	mockRepositoryCurrency := new(mock_repository.MockCurrency)

	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := &model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	mockRepositoryCurrency.On("Insert").Return(currency, nil)

	usecaseCurrency := NewCurrency(mockRepositoryCurrency)

	currencyResult, err := usecaseCurrency.Insert(currency)

	assert.Nil(t, err)
	assert.NotNil(t, currencyResult)
	assert.NotEqual(t, currency.ID, currencyResult.ID)
	assert.Equal(t, currency.ShortName, currencyResult.ShortName)
	assert.Equal(t, currency.RateUSD, currencyResult.RateUSD)
	assert.Equal(t, currency.ReferenceDate, currencyResult.ReferenceDate)
	assert.NotEqual(t, currency.CreatedAt, currencyResult.CreatedAt)
}
