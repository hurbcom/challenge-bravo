package usecases

import (
	"errors"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
)

type currencyUsecase struct {
	currencyRepository repositories.CurrencyRepository
}

type CurrencyUsecase interface {
	CreateCurrency(currency *models.Currency) error
	GetAllCurrencies() (*[]models.Currency, error)
	GetCurrencyBy(column string, value string) (*models.Currency, error)
	DeleteCurrency(id int) error
}

func InitializeCurrencyUsecase(repository repositories.CurrencyRepository) CurrencyUsecase {
	return &currencyUsecase{repository}
}

func (usecase *currencyUsecase) CreateCurrency(currency *models.Currency) error {
	if currency == nil {
		return errors.New("currency is nil")
	}

	if !currency.IsValid() {
		return errors.New("key and description cannot be empty")
	}

	err := usecase.currencyRepository.CreateCurrency(currency)
	if err != nil {
		return err
	}
	return nil
}

func (usecase *currencyUsecase) GetAllCurrencies() (*[]models.Currency, error) {
	return usecase.currencyRepository.GetAllCurrencies()
}

func (usecase *currencyUsecase) GetCurrencyBy(column string, value string) (*models.Currency, error) {
	currency, _ := usecase.currencyRepository.GetCurrencyBy(column, value)
	if currency == nil {
		return nil, errors.New("currency is not found")
	}
	return currency, nil
}

func (usecase *currencyUsecase) DeleteCurrency(id int) error {
	return usecase.currencyRepository.DeleteCurrency(id)
}
