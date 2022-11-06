package repositories

import (
	"errors"
	"log"
	"time"

	"github.com/victorananias/challenge-bravo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const COLLECTION_NAME = "rates"

var NoDocumentInResultErrMessage = "mongo: no documents in result"
var ErrNoDocumentFound error = errors.New("no document found")

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

func (repository *RatesRepository) DeleteByCurrencyCode(currencyCode string) error {
	filter := bson.M{"currencyCode": currencyCode, "backingCurrencyCode": repository.settings.BackingCurrencyCode}
	res, err := repository.collection().DeleteOne(repository.ctx, filter)
	log.Print(res)
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return ErrNoDocumentFound
	}
	return nil
}

func (repository *RatesRepository) CreateOrUpdate(rate models.Rate) error {
	filter := bson.D{
		{Key: "currencyCode", Value: rate.Code},
		{Key: "backingCurrencyCode", Value: rate.BackingCurrencyCode},
	}
	rateDoc := bson.D{{
		Key: "$set", Value: bson.D{
			{Key: "currencyCode", Value: rate.Code},
			{Key: "backingCurrencyCode", Value: rate.BackingCurrencyCode},
			{Key: "value", Value: rate.Value},
			{Key: "updatedAt", Value: time.Now()},
		},
	}}
	opts := options.Update().SetUpsert(true)
	_, err := repository.collection().UpdateOne(repository.ctx, filter, rateDoc, opts)
	if err != nil && err.Error() == NoDocumentInResultErrMessage {
		return ErrNoDocumentFound
	}
	return err
}

func (repository *RatesRepository) GetRate(currencyCode, backingCurrencyCode string) (models.Rate, error) {
	var rate models.Rate
	where := bson.D{
		{Key: "currencyCode", Value: currencyCode},
		{Key: "backingCurrencyCode", Value: backingCurrencyCode},
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

func (repository *RatesRepository) collection() *mongo.Collection {
	return repository.db.Collection(repository.collectionName)
}
