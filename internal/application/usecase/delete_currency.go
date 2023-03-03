package usecase

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/repositories"
)

type DeleteCurrencyUseCase struct {
	repository         repositories.CurrencyRepository
	cacheRepository    repositories.CurrencyCacheRepository
	officialCurrencies []string
}

func NewDeleteCurrencyUseCase(repository repositories.CurrencyRepository, cacheRepository repositories.CurrencyCacheRepository, officialCurrencies []string) *DeleteCurrencyUseCase {
	return &DeleteCurrencyUseCase{
		repository:         repository,
		cacheRepository:    cacheRepository,
		officialCurrencies: officialCurrencies,
	}
}

func (deleteCurrencyUseCase *DeleteCurrencyUseCase) DeleteCurrency(name string) error {
	currency := &entity.Currency{
		Name: name,
	}

	if currency.IsOfficialCurrency(deleteCurrencyUseCase.officialCurrencies) {
		return &errors.CurrencyAlreadyExists{
			Name: name,
		}
	}

	currencyIsCached := deleteCurrencyUseCase.cacheRepository.GetCurrency(name)
	if currencyIsCached != nil {
		return deleteCurrencyUseCase.delete(currencyIsCached)
	}

	currencyFound, err := deleteCurrencyUseCase.repository.GetCurrencyByName(name)
	if err != nil {
		return err
	}

	if currencyFound == nil {
		return &errors.CurrencyNotFound{
			Name: name,
		}
	}

	return deleteCurrencyUseCase.delete(currencyFound)
}

func (deleteCurrencyUseCase *DeleteCurrencyUseCase) delete(currency *entity.Currency) error {
	err := deleteCurrencyUseCase.repository.DeleteCurrency(currency.Name)
	if err != nil {
		return err
	}

	ok := deleteCurrencyUseCase.cacheRepository.DeleteCurrency(currency.Name)
	if !ok {
		fmt.Printf("Failed to delete currency from cache '%s'\n", currency.Name)
	}

	return nil
}
