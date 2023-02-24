package usecase

import (
	"fmt"
	"strings"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
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
	CacheCurrency      cache.Currency
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

func NewCurrency(repositoryCurrency repository.Currency, cacheCurrency cache.Currency) Currency {
	return &CurrencyUseCase{
		RepositoryCurrency: repositoryCurrency,
		CacheCurrency:      cacheCurrency,
	}
}

func (currencyUsecase *CurrencyUseCase) Insert(currencyModel *model.Currency) (*model.Currency, error) {
	err := currencyUsecase.validateCurrencyModel(currencyModel)

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
	err := currencyUsecase.validateCurrencyModel(currencyModel)

	if err != nil {
		return nil, err
	}

	currencyModelUpdated, err := currencyUsecase.RepositoryCurrency.Update(currencyModel)

	if err == nil {
		_, errCache := currencyUsecase.CacheCurrency.GetByShortName(currencyModelUpdated.ShortName)

		if errCache != nil {
			currencyUsecase.CacheCurrency.SetByShortName(currencyModelUpdated)
		}
	}

	return currencyUsecase.RepositoryCurrency.Update(currencyModel)
}

func (currencyUsecase *CurrencyUseCase) Delete(id int64) error {
	return currencyUsecase.RepositoryCurrency.Delete(id)
}

func (currencyUsecase *CurrencyUseCase) Convert(currencyConvertModel *model.CurrencyConvert) (*model.CurrencyConvertResponse, error) {
	err := currencyUsecase.validateCurrencyConvertModel(currencyConvertModel)

	if err != nil {
		return nil, err
	}

	currencyFrom, err := currencyUsecase.getByShortName(currencyConvertModel.From)

	if err != nil {
		if _, ok := err.(repository.ErrNotFound); ok {
			err = ErrCurrencyConvertValidate{Message: "Currency From not found"}
		}

		return nil, err
	}

	currencyTo, err := currencyUsecase.getByShortName(currencyConvertModel.To)

	if err != nil {
		if _, ok := err.(repository.ErrNotFound); ok {
			err = ErrCurrencyConvertValidate{Message: "Currency To not found"}
		}

		return nil, err
	}

	toAmount := ((currencyConvertModel.Amount / currencyFrom.RateUSD) * currencyTo.RateUSD)

	currencyConvertResponse := &model.CurrencyConvertResponse{
		FromCurrency:      currencyFrom.ShortName,
		FromAmount:        float32(currencyConvertModel.Amount),
		FromReferenceDate: currencyFrom.ReferenceDate,
		ToCurrency:        currencyTo.ShortName,
		ToAmount:          float32(util.MathRoundPrecision(float64(toAmount), 6)), // round to 6 decimals precision
		ToReferenceDate:   currencyTo.ReferenceDate,
	}

	return currencyConvertResponse, nil
}

func (currencyUsecase *CurrencyUseCase) getByShortName(shortName string) (currencyModel *model.Currency, err error) {
	currencyModel, err = currencyUsecase.CacheCurrency.GetByShortName(shortName)

	if err != nil {
		currencyModel, err = currencyUsecase.RepositoryCurrency.GetByShortName(shortName)

		if err == nil {
			currencyUsecase.CacheCurrency.SetByShortName(currencyModel)
		}
	}

	return currencyModel, err
}

func (currencyUsecase *CurrencyUseCase) validateCurrencyModel(currencyModel *model.Currency) error {
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

func (currencyUsecase *CurrencyUseCase) validateCurrencyConvertModel(currencyConvertModel *model.CurrencyConvert) error {
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
