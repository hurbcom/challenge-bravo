package repository

import (
	"context"
	"github.com/VictorNapoles/challenge-bravo/infra/cache"
	"github.com/VictorNapoles/challenge-bravo/infra/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	CURRENCY_COLLECTION = "currency"

	QuoteToBankCurrency QuoteTypeEntity = iota
	QuoteFromBankCurrency
	QuoteNotAvailable
)

type (
	QuoteTypeEntity uint8

	CurrencyEntity struct {
		ID                    primitive.ObjectID `bson:"_id,omitempty"`
		Code                  string             `bson:"code"`
		CurrencyName          string             `bson:"currencyName"`
		UnitValueBankCurrency float64            `bson:"unitValueBankCurrency"`
		QuoteType             QuoteTypeEntity    `bson:"quoteType"`
	}

	CurrencyRepository interface {
		GetByCode(code string) (*CurrencyEntity, error)
		Save(entity *CurrencyEntity) (*CurrencyEntity, error)
		Delete(code string) (int64, error)
	}

	currencyRepositoryImpl struct {
		db           database.MongoDatabaseConnection
		cache        cache.RedisCacheConnection
		databaseName string
	}
)

func NewCurrencyRepository(db database.MongoDatabaseConnection, cache cache.RedisCacheConnection, databaseName string) CurrencyRepository {
	return &currencyRepositoryImpl{
		db:           db,
		cache:        cache,
		databaseName: databaseName,
	}
}

func (c *currencyRepositoryImpl) GetByCode(code string) (*CurrencyEntity, error) {
	var currency CurrencyEntity
	err := c.getCollection().FindOne(context.TODO(), bson.D{{"code", code}}).Decode(&currency)
	if err != nil {
		return nil, err
	}
	return &currency, nil
}

func (c *currencyRepositoryImpl) Save(entity *CurrencyEntity) (*CurrencyEntity, error) {
	result, err := c.getCollection().InsertOne(context.TODO(), entity)
	if err != nil {
		return &CurrencyEntity{}, err
	}
	var currency CurrencyEntity
	err = c.getCollection().FindOne(context.TODO(), bson.D{{"_id", result.InsertedID}}).Decode(&currency)
	if err != nil {
		return &CurrencyEntity{}, err
	}
	return &currency, nil
}

func (c *currencyRepositoryImpl) Delete(code string) (int64, error) {
	filter := bson.D{{"code", code}}
	result, err := c.getCollection().DeleteMany(context.TODO(), filter, nil)

	if err != nil {
		return 0, err
	}

	return result.DeletedCount, nil
}
func (c *currencyRepositoryImpl) getCollection() *mongo.Collection {
	database := c.db.Database(c.databaseName)
	collection := database.Collection(CURRENCY_COLLECTION)
	return collection
}
