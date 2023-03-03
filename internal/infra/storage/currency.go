package storage

import (
	"context"
	"time"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CurrencyDocument struct {
	Id        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Rate      float64            `bson:"rate"`
	CreatedAt time.Time          `bson:"createdAt"`
}

func (currency *CurrencyDocument) MarshalBSON() ([]byte, error) {
	if currency.CreatedAt.IsZero() {
		currency.CreatedAt = time.Now()
	}

	type newCurrency CurrencyDocument
	return bson.Marshal((*newCurrency)(currency))
}

type CurrencyRepository struct {
	collection *mongo.Collection
}

const CURRENCY_COLLECTION = "currencies"

func NewCurrencyRepository(client *StorageClient) *CurrencyRepository {
	return &CurrencyRepository{
		collection: client.database.Collection(CURRENCY_COLLECTION),
	}
}

func (repository *CurrencyRepository) CreateCurrency(currency *entity.Currency) (*entity.Currency, error) {
	newCurrency := &CurrencyDocument{
		Id:   primitive.NewObjectID(),
		Name: currency.Name,
		Rate: currency.Rate,
	}

	_, err := repository.collection.InsertOne(context.TODO(), newCurrency)
	if err != nil {
		return nil, &errors.UnprocessableError{
			Message: "Failed to create currency data",
		}
	}

	return currency, nil
}

func (repository *CurrencyRepository) GetCurrencyByName(name string) (*entity.Currency, error) {
	filter := bson.M{
		"name": name,
	}

	var currency entity.Currency
	err := repository.collection.FindOne(context.TODO(), filter).Decode(&currency)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}

		return nil, &errors.StorageError{
			Entity: "Currency",
		}
	}

	return &currency, nil
}

func (repository *CurrencyRepository) DeleteCurrency(name string) error {
	filter := bson.M{
		"name": name,
	}

	_, err := repository.collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return &errors.StorageError{
			Entity: "Currency",
		}
	}

	return nil
}
