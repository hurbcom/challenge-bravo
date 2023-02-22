package usecase

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
)

type Currency interface {
	Insert(currencyModel *model.Currency) (*model.Currency, error)
	GetByID(id int64) (*model.Currency, error)
	List() (*model.Currencies, error)
	Update(currencyModel *model.Currency) (*model.Currency, error)
	Delete(id int64) error
	Convert(currencyConvert *model.CurrencyConvert) (*model.CurrencyConvertResponse, error)
}

type CurrencyUseCase struct {
	RepositoryCurrency repository.Currency
}

// ErrCurrencyValidate denotes failing validate currency.
type ErrCurrencyValidate struct {
	Message string
}

// ErrCurrencyValidate returns the currency validation error.
func (ecv ErrCurrencyValidate) Error() string {
	return ecv.Message
}

// ErrCurrencyConvertValidate denotes failing validate currency convert.
type ErrCurrencyConvertValidate struct {
	Message string
}

// Error returns the currency validation error.
func (eccv ErrCurrencyConvertValidate) Error() string {
	return eccv.Message
}

func NewCurrency(repositoryCurrency repository.Currency) Currency {
	return &CurrencyUseCase{
		RepositoryCurrency: repositoryCurrency,
	}
}

func (currencyUsecase *CurrencyUseCase) Insert(currencyModel *model.Currency) (*model.Currency, error) {
	err := validateCurrencyModel(currencyModel)

	if err != nil {
		return nil, err
	}

	return currencyUsecase.RepositoryCurrency.Insert(currencyModel)
}

func (currencyUsecase *CurrencyUseCase) GetByID(id int64) (*model.Currency, error) {
	return currencyUsecase.RepositoryCurrency.GetByID(id)
}

func (currencyUsecase *CurrencyUseCase) List() (*model.Currencies, error) {
	return currencyUsecase.RepositoryCurrency.List()
}

func (currencyUsecase *CurrencyUseCase) Update(currencyModel *model.Currency) (*model.Currency, error) {
	err := validateCurrencyModel(currencyModel)

	if err != nil {
		return nil, err
	}

	return currencyUsecase.RepositoryCurrency.Update(currencyModel)
}

func (currencyUsecase *CurrencyUseCase) Delete(id int64) error {
	return currencyUsecase.RepositoryCurrency.Delete(id)
}

func (currencyUsecase *CurrencyUseCase) Convert(currencyConvertModel *model.CurrencyConvert) (*model.CurrencyConvertResponse, error) {
	err := validateCurrencyConvertModel(currencyConvertModel)

	if err != nil {
		return nil, err
	}

	currencyFrom, err := currencyUsecase.RepositoryCurrency.GetByShortName(currencyConvertModel.From)

	if err != nil {
		if _, ok := err.(repository.ErrNotFound); ok {
			err = ErrCurrencyConvertValidate{Message: "Currency From not found"}
		}

		return nil, err
	}

	currencyTo, err := currencyUsecase.RepositoryCurrency.GetByShortName(currencyConvertModel.To)

	if err != nil {
		if _, ok := err.(repository.ErrNotFound); ok {
			err = ErrCurrencyConvertValidate{Message: "Currency To not found"}
		}

		return nil, err
	}

	toAmount := ((currencyConvertModel.Amount / currencyFrom.RateUSD) * currencyTo.RateUSD)

	// round to 4 decimals
	precision := 4
	toAmount = float32(math.Round(float64(toAmount)*(math.Pow10(precision))) / math.Pow10(precision))

	currencyConvertResponse := &model.CurrencyConvertResponse{
		FromCurrency:      currencyFrom.ShortName,
		FromAmount:        float32(currencyConvertModel.Amount),
		FromReferenceDate: currencyFrom.ReferenceDate,
		ToCurrency:        currencyTo.ShortName,
		ToAmount:          toAmount,
		ToReferenceDate:   currencyTo.ReferenceDate,
	}

	return currencyConvertResponse, nil
}

func validateCurrencyModel(currencyModel *model.Currency) error {
	message := []string{}
	referenceDateMin := time.Date(1900, 01, 01, 00, 00, 00, 000, time.UTC)
	referenceDateMax := time.Now().UTC().Truncate(24 * time.Hour)

	if currencyModel.ShortName == "" {
		message = append(message, "The short_name is empty")
	} else if len(currencyModel.ShortName) < 3 || len(currencyModel.ShortName) > 10 {
		message = append(message, "The short_name size is not between 3 and 10")
	}

	if currencyModel.RateUSD == 0 {
		message = append(message, "The rate_usd is zero")
	}

	if currencyModel.ReferenceDate.IsZero() {
		message = append(message, "The reference_date is empty")
	} else if currencyModel.ReferenceDate.Before(referenceDateMin) || currencyModel.ReferenceDate.After(referenceDateMax) {
		message = append(message, fmt.Sprintf("The reference_date value is not between %v and %v", referenceDateMin, referenceDateMax))
	}

	if len(message) > 0 {
		return ErrCurrencyValidate{Message: strings.Join(message, ";")}
	}

	return nil
}

func validateCurrencyConvertModel(currencyConvertModel *model.CurrencyConvert) error {
	message := []string{}

	if currencyConvertModel.From == "" {
		message = append(message, "The Current From is empty")
	} else if len(currencyConvertModel.From) < 3 || len(currencyConvertModel.From) > 10 {
		message = append(message, "The Current From size is not between 3 and 10")
	}

	if currencyConvertModel.To == "" {
		message = append(message, "The Current To is empty")
	} else if len(currencyConvertModel.To) < 3 || len(currencyConvertModel.To) > 10 {
		message = append(message, "The Current To size is not between 3 and 10")
	}

	if currencyConvertModel.Amount == 0 {
		message = append(message, "The amount is zero")
	}

	if len(message) > 0 {
		return ErrCurrencyConvertValidate{Message: strings.Join(message, ";")}
	}

	return nil
}
