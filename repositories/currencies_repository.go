package repositories

import (
	"errors"
	"time"

	"github.com/victorananias/challenge-bravo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const COLLECTION_NAME = "currencies"

var NoDocumentInResultErr = errors.New("mongo: no documents in result")

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
	filter := bson.D{
		{Key: "code", Value: currency.Code},
		{Key: "backingCurrencyCode", Value: currency.BackingCurrencyCode},
	}
	currencyDoc := bson.D{{
		Key: "$set", Value: bson.D{
			{Key: "code", Value: currency.Code},
			{Key: "backingCurrencyCode", Value: currency.BackingCurrencyCode},
			{Key: "value", Value: currency.Value},
			{Key: "updatedAt", Value: time.Now()},
		},
	}}
	opts := options.Update().SetUpsert(true)
	updateResult, err := repository.collection().UpdateOne(repository.ctx, filter, currencyDoc, opts)
	if err != nil {
		return "", err
	}
	return updateResult.UpsertedID.(primitive.ObjectID).String(), nil
}

func (repository *CurrenciesRepository) Get(code, backingCurrencyCode string) (models.Currency, error) {
	var currency models.Currency
	where := bson.D{
		{Key: "code", Value: code},
		{Key: "backingCurrencyCode", Value: backingCurrencyCode},
	}
	result := repository.collection().FindOne(repository.ctx, where)
	if err := result.Err(); err != nil {
		return currency, err
	}
	repository.collection()
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
