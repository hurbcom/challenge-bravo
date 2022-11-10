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
	GetCurrencyById(id int) (*models.Currency, error)
	GetCurrencyByKey(key string) (*models.Currency, error)
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

	if !currency.ExchangeApi && (currency.CustomCurrency == "" || currency.CustomAmount == 0) {
		return errors.New("for custom currencies, CustomCurrency and CustomAmount cannot be empty")
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

func (usecase *currencyUsecase) GetCurrencyById(id int) (*models.Currency, error) {
	currency, _ := usecase.currencyRepository.GetCurrencyById(id)
	if currency == nil {
		return nil, errors.New("currency is not found")
	}
	return currency, nil
}

func (usecase *currencyUsecase) GetCurrencyByKey(key string) (*models.Currency, error) {
	currency, _ := usecase.currencyRepository.GetCurrencyByKey(key)
	if currency == nil {
		return nil, errors.New("currency is not found")
	}
	return currency, nil
}

func (usecase *currencyUsecase) DeleteCurrency(id int) error {
	return usecase.currencyRepository.DeleteCurrency(id)
}
