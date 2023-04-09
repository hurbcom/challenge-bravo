package repository

import (
    "github.com/VictorNapoles/challenge-bravo/infra/cache"
    "github.com/VictorNapoles/challenge-bravo/infra/database"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type (
    PriceEntity struct {
        ID                    primitive.ObjectID `bson:"_id"`
        Code                  string             `bson:"code"`
        CurrencyName          string             `bson:"currencyName"`
        UnitValueBankCurrency float64            `bson:"unitValueBankCurrency"`
    }

    PriceRepository interface {
        GetByCode(code string) (PriceEntity, error)
        Save(entity PriceEntity) (PriceEntity, error)
        Remove(code string) (bool, error)
    }

    priceRepositoryImpl struct {
        db    database.MongoDatabaseConnection
        cache cache.RedisCacheConnection
    }
)

func NewPriceRepository(db database.MongoDatabaseConnection, cache cache.RedisCacheConnection) PriceRepository {
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
