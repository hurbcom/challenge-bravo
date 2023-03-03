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

	_, err := deleteCurrencyUseCase.repository.GetCurrencyByName(name)
	if err != nil {
		return err
	}

	err = deleteCurrencyUseCase.repository.DeleteCurrency(name)
	if err != nil {
		return err
	}

	ok := deleteCurrencyUseCase.cacheRepository.DeleteCurrency(name)
	if !ok {
		fmt.Printf("Failed to delete currency '%s'\n", name)
	}

	return nil
}
