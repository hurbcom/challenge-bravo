package usecase

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/repositories"
)

type CurrencyPayload struct {
	Name string  `json:"name" validate:"required"`
	Rate float64 `json:"rate" validate:"required"`
}

type CreateCurrencyUseCase struct {
	repository         repositories.CurrencyRepository
	cacheRepository    repositories.CurrencyCacheRepository
	officialCurrencies []string
}

func NewCreateCurrencyUseCase(repository repositories.CurrencyRepository, cacheRepository repositories.CurrencyCacheRepository, officialCurrencies []string) *CreateCurrencyUseCase {
	return &CreateCurrencyUseCase{
		repository:         repository,
		cacheRepository:    cacheRepository,
		officialCurrencies: officialCurrencies,
	}
}

func (createCurrency *CreateCurrencyUseCase) CreateCurrency(payload *CurrencyPayload) (*entity.Currency, error) {
	newCurrency := &entity.Currency{
		Name: payload.Name,
		Rate: payload.Rate,
	}

	if newCurrency.IsOfficialCurrency(createCurrency.officialCurrencies) {
		return nil, &errors.CurrencyAlreadyExists{
			Name: payload.Name,
		}
	}

	currencyIsCached := createCurrency.cacheRepository.GetCurrency(payload.Name)
	if currencyIsCached != nil {
		return nil, &errors.CurrencyAlreadyExists{
			Name: currencyIsCached.Name,
		}
	}

	currencyAlreadyExists, err := createCurrency.repository.GetCurrencyByName(payload.Name)
	if err != nil {
		return nil, err
	}

	if currencyAlreadyExists != nil {
		return nil, &errors.CurrencyAlreadyExists{
			Name: currencyAlreadyExists.Name,
		}
	}

	createdCurrency, err := createCurrency.repository.CreateCurrency(newCurrency)
	if err != nil {
		return nil, err
	}

	ok := createCurrency.cacheRepository.CreateCurrency(createdCurrency)
	if !ok {
		fmt.Println("Failed to save currency")
	}

	return createdCurrency, nil
}
