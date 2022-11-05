package repositories

import (
	"time"

	"github.com/victorananias/challenge-bravo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const COLLECTION_NAME = "rates"

var NoDocumentInResultErrMessage = "mongo: no documents in result"

type RatesRepository struct {
	*Repository
	collectionName string
}

func NewExchangesRepository() *RatesRepository {
	return &RatesRepository{
		Repository:     NewRepository(),
		collectionName: COLLECTION_NAME,
	}
}

func (repository *RatesRepository) Create(rate models.Rate) error {
	filter := bson.D{
		{Key: "currencyCode", Value: rate.Code},
		{Key: "backingRateCode", Value: rate.BackingCurrencyCode},
	}
	rateDoc := bson.D{{
		Key: "$set", Value: bson.D{
			{Key: "currencyCode", Value: rate.Code},
			{Key: "backingRateCode", Value: rate.BackingCurrencyCode},
			{Key: "value", Value: rate.Value},
			{Key: "updatedAt", Value: time.Now()},
		},
	}}
	opts := options.Update().SetUpsert(true)
	_, err := repository.collection().UpdateOne(repository.ctx, filter, rateDoc, opts)
	if err != nil {
		return err
	}
	return nil
}

func (repository *RatesRepository) GetExchange(currencyCode, backingRateCode string) (models.Rate, error) {
	var rate models.Rate
	where := bson.D{
		{Key: "currencyCode", Value: currencyCode},
		{Key: "backingRateCode", Value: backingRateCode},
	}
	result := repository.collection().FindOne(repository.ctx, where)
	if err := result.Err(); err != nil {
		return rate, err
	}
	repository.collection()
	if err := result.Decode(&rate); err != nil {
		return rate, err
	}
	return rate, nil
}

// func (repository *CurrenciesRepository) List() (error, []models.rate) {
// 	users := []models.rate{}
// 	result, err := repository.collection().Find(repository.ctx, bson.D{})
// 	if err != nil {
// 		return err, nil
// 	}
// 	err = result.All(repository.ctx, &users)
// 	return err, users
// }

func (repository *RatesRepository) collection() *mongo.Collection {
	return repository.db.Collection(repository.collectionName)
}
