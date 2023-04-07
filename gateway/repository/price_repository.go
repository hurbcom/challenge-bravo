package repository

import (
	"github.com/VictorNapoles/challenge-bravo/infra/cache"
	"github.com/VictorNapoles/challenge-bravo/infra/database"
)

type (
	PriceEntity struct {
		ID                    int64
		Code                  string
		CurrencyName          string
		UnitValueBankCurrency float64
	}

	PriceRepository interface {
		GetByCode(code string) (PriceEntity, error)
		Save(entity PriceEntity) (PriceEntity, error)
		Remove(code string) (bool, error)
	}

	priceRepositoryImpl struct {
		db    database.DatabaseConnection
		cache cache.RedisCacheConnection
	}
)

func NewPriceRepository(db database.DatabaseConnection, cache cache.RedisCacheConnection) PriceRepository {
	return &priceRepositoryImpl{
		db:    db,
		cache: cache,
	}
}

func (p priceRepositoryImpl) GetByCode(code string) (PriceEntity, error) {
	//TODO implement me
	panic("implement me")
}

func (p priceRepositoryImpl) Save(entity PriceEntity) (PriceEntity, error) {
	//TODO implement me
	panic("implement me")
}

func (p priceRepositoryImpl) Remove(code string) (bool, error) {
	//TODO implement me
	panic("implement me")
}
