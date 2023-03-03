package strategy

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/repositories"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/request"
)

type OfficialCurrencyStrategy struct {
	client          request.RequestHandler
	cacheRepository repositories.CurrencyCacheRepository
}

func NewOfficialCurrencyStrategy(client request.RequestHandler, cacheRepository repositories.CurrencyCacheRepository) *OfficialCurrencyStrategy {
	return &OfficialCurrencyStrategy{
		client:          client,
		cacheRepository: cacheRepository,
	}
}

func (strategy *OfficialCurrencyStrategy) GetCurrency(name string) (*entity.Currency, error) {
	cachedCurrency := strategy.cacheRepository.GetCurrency(name)
	if cachedCurrency != nil {
		return cachedCurrency, nil
	}

	responseCurrency, err := strategy.client.GetCurrency(name)
	if err != nil {
		return nil, err
	}

	ok := strategy.cacheRepository.CreateCurrency(responseCurrency)
	if !ok {
		fmt.Println("Failed to save currency")
	}

	return responseCurrency, nil
}
