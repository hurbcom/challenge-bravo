package usecases

import (
	"errors"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	repositories "github.com/felipepnascimento/challenge-bravo-flp/repositories"
)

type currencyUsecase struct {
	currencyRepository repositories.CurrencyRepository
}

type CurrencyUsecase interface {
	CreateCurrency(currency *entities.Currency) error
	GetAllCurrencies() (*[]entities.Currency, error)
	GetCurrencyByID(id int) (*entities.Currency, error)
	DeleteCurrency(id int) error
}

func InitializeCurrencyUsecase(repository repositories.CurrencyRepository) CurrencyUsecase {
	return &currencyUsecase{repository}
}

func (usecase *currencyUsecase) CreateCurrency(currency *entities.Currency) error {
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

func (usecase *currencyUsecase) GetAllCurrencies() (*[]entities.Currency, error) {
	return usecase.currencyRepository.GetAllCurrencies()
}

func (usecase *currencyUsecase) GetCurrencyByID(id int) (*entities.Currency, error) {
	currency, _ := usecase.currencyRepository.GetCurrencyByID(id)
	if currency == nil {
		return nil, errors.New("currency is not found")
	}
	return currency, nil
}

func (usecase *currencyUsecase) DeleteCurrency(id int) error {
	return usecase.currencyRepository.DeleteCurrency(id)
}
