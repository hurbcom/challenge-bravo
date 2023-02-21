package usecase

import (
	"testing"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/stretchr/testify/assert"
)

func TestInsertShortNameEmptyError(t *testing.T) {
	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency()

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The short_name is empty", err.Error())
}

func TestInsertRateUSDZeroError(t *testing.T) {
	referenceDate, _ := time.Parse("2006-01-02", "1900-01-01")

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       0,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency()

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The rate_usd is zero", err.Error())
}

func TestInsertReferenceDateEmptyError(t *testing.T) {
	currency := model.Currency{
		ShortName: "TEST",
		RateUSD:   1.23,
	}

	usecaseCurrency := NewCurrency()

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Equal(t, "The reference_date is empty", err.Error())
}

func TestInsertReferenceDateBeforeError(t *testing.T) {
	referenceDate, _ := time.Parse("2006-01-02", "1899-12-31")

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency()

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "The reference_date before ")
}

func TestInsertReferenceDateAfterError(t *testing.T) {
	referenceDate := time.Now().UTC().Truncate(24*time.Hour).AddDate(0, 0, 1)

	currency := model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDate,
	}

	usecaseCurrency := NewCurrency()

	currencyResult, err := usecaseCurrency.Insert(&currency)

	assert.Nil(t, currencyResult)
	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "The reference_date after ")
}
