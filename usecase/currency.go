package usecase

import (
	"fmt"
	"strings"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
)

type Currency interface {
	Insert(currencyModel *model.Currency) (*model.Currency, error)
	GetByID(id int64) (*model.Currency, error)
}

type CurrencyUseCase struct{}

// CurrencyValidateError denotes failing validate currency.
type CurrencyValidateError struct {
	Message string
}

// Error returns the currency validation error.
func (cve CurrencyValidateError) Error() string {
	return cve.Message
}

func NewCurrency() Currency {
	return &CurrencyUseCase{}
}

func (*CurrencyUseCase) Insert(currencyModel *model.Currency) (*model.Currency, error) {
	err := validateCurrencyModel(currencyModel)

	if err != nil {
		return nil, err
	}

	currencyModel.ID = 1
	currencyModel.CreatedAt = time.Now().UTC()

	return currencyModel, nil
}

func (*CurrencyUseCase) GetByID(id int64) (*model.Currency, error) {
	currency := model.Currency{
		ID:            1,
		ShortName:     "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}

	return &currency, nil
}

func validateCurrencyModel(currencyModel *model.Currency) error {
	message := []string{}
	referenceDateMin := time.Date(1900, 01, 01, 00, 00, 00, 000, time.UTC)
	referenceDateMax := time.Now().UTC().Truncate(24 * time.Hour)

	if currencyModel.ShortName == "" {
		message = append(message, "The short_name is empty")
	}

	if currencyModel.RateUSD == 0 {
		message = append(message, "The rate_usd is zero")
	}

	if currencyModel.ReferenceDate.IsZero() {
		message = append(message, "The reference_date is empty")
	} else if currencyModel.ReferenceDate.Before(referenceDateMin) {
		message = append(message, fmt.Sprintf("The reference_date before %v", referenceDateMin.Local()))
	} else if currencyModel.ReferenceDate.After(referenceDateMax) {
		message = append(message, fmt.Sprintf("The reference_date after %v", referenceDateMax.Local()))
	}

	if len(message) > 0 {
		return CurrencyValidateError{Message: strings.Join(message, ";")}
	}

	return nil
}
