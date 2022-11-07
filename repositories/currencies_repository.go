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

const COLLECTION_NAME = "currencies"

var NoDocumentInResultErrMessage = "mongo: no documents in result"
var ErrNoDocumentFound error = errors.New("no document found")

type ICurrenciesRepository interface {
	DeleteByCurrencyCode(string) error
	CreateOrUpdate(models.Currency) error
	GetCurrency(string, string) (models.Currency, error)
}

type CurrenciesRepository struct {
	*Repository
	collectionName string
}

func NewCurrenciesRepository() ICurrenciesRepository {
	return &CurrenciesRepository{
		Repository:     NewRepository(),
		collectionName: COLLECTION_NAME,
	}
}

func (repository *CurrenciesRepository) DeleteByCurrencyCode(code string) error {
	filter := bson.M{"code": code, "backingCurrencyCode": repository.settings.BackingCurrencyCode}
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

func (repository *CurrenciesRepository) CreateOrUpdate(currency models.Currency) error {
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
	_, err := repository.collection().UpdateOne(repository.ctx, filter, currencyDoc, opts)
	if err != nil && err.Error() == NoDocumentInResultErrMessage {
		return ErrNoDocumentFound
	}
	return err
}

func (repository *CurrenciesRepository) GetCurrency(code, backingCurrencyCode string) (models.Currency, error) {
	var currency models.Currency
	where := bson.D{
		{Key: "code", Value: code},
		{Key: "backingCurrencyCode", Value: backingCurrencyCode},
	}
	result := repository.collection().FindOne(repository.ctx, where)
	err := result.Err()
	if err != nil && err.Error() == NoDocumentInResultErrMessage {
		return currency, ErrNoDocumentFound
	}
	repository.collection()
	if err := result.Decode(&currency); err != nil {
		return currency, err
	}
	return currency, nil
}

func (repository *CurrenciesRepository) collection() *mongo.Collection {
	return repository.db.Collection(repository.collectionName)
}
