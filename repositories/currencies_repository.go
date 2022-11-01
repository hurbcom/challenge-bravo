package repositories

import (
	"time"

	"github.com/victorananias/challenge-bravo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const COLLECTION_NAME = "currencies"

type CurrenciesRepository struct {
	*Repository
	collectionName string
}

func NewCurrenciesRepository() *CurrenciesRepository {
	return &CurrenciesRepository{
		Repository:     NewRepository(),
		collectionName: COLLECTION_NAME,
	}
}

func (repository *CurrenciesRepository) Create(currency models.Currency) (insertedID string, err error) {
	currency.UpdatedAt = time.Now()
	insertResult, err := repository.collection().InsertOne(repository.ctx, currency)
	if err != nil {
		return "", err
	}
	return insertResult.InsertedID.(primitive.ObjectID).String(), nil
}

func (repository *CurrenciesRepository) Get(code, backingCurrencyCode string) (models.Currency, error) {
	var currency models.Currency
	where := bson.D{{Key: "code", Value: code}, {Key: "backingCurrencyCode", Value: backingCurrencyCode}}
	result := repository.collection().FindOne(repository.ctx, where)
	if err := result.Err(); err != nil {
		return currency, err
	}
	if err := result.Decode(&currency); err != nil {
		return currency, err
	}
	return currency, nil
}

// func (repository *CurrenciesRepository) List() (error, []models.Currency) {
// 	users := []models.Currency{}
// 	result, err := repository.collection().Find(repository.ctx, bson.D{})
// 	if err != nil {
// 		return err, nil
// 	}
// 	err = result.All(repository.ctx, &users)
// 	return err, users
// }

func (repository *CurrenciesRepository) collection() *mongo.Collection {
	return repository.db.Collection(repository.collectionName)
}
