package strategy

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/repositories"
)

type CustomCurrencyStrategy struct {
	repository      repositories.CurrencyRepository
	cacheRepository repositories.CurrencyCacheRepository
}

func NewCustomCurrencyStrategy(repository repositories.CurrencyRepository, cacheRepository repositories.CurrencyCacheRepository) *CustomCurrencyStrategy {
	return &CustomCurrencyStrategy{
		repository:      repository,
		cacheRepository: cacheRepository,
	}
}

func (strategy *CustomCurrencyStrategy) GetCurrency(name string) (*entity.Currency, error) {
	cachedCurrency := strategy.cacheRepository.GetCurrency(name)
	if cachedCurrency != nil {
		return cachedCurrency, nil
	}

	currency, err := strategy.repository.GetCurrencyByName(name)
	if err != nil {
		return nil, err
	}

	if currency == nil {
		return nil, &errors.CurrencyNotFound{
			Name: name,
		}
	}

	ok := strategy.cacheRepository.CreateCurrency(currency)
	if !ok {
		fmt.Println("Failed to save currency")
	}

	return currency, nil
}
