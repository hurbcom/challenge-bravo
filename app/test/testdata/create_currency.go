package testdata

import (
	"context"
	"time"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/currency_repository"
)

func CreateCurrency() (entity.Currency, error) {
	zeroValue := entity.Currency{}

	currency, err := currency_repository.New().Create(context.TODO(), entity.Currency{
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		Name:            "Test",
		Code:            "TST",
		USDExchangeRate: 1,
		CreatedBy:       1,
		UpdatedBy:       1,
	})
	if err != nil {
		return zeroValue, nil
	}

	return currency, nil
}
