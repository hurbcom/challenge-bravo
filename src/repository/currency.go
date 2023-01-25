package repository

import (
	"challenge-bravo/src/models"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CurrencyRepository struct {
	collection *mongo.Collection
}

func NewCurrencyRepository(collection *mongo.Collection) *CurrencyRepository {
	return &CurrencyRepository{collection}
}

func (repositoryCurrency CurrencyRepository) Create(currency models.Currency) error {
	_, err := repositoryCurrency.collection.InsertOne(context.TODO(), currency)
	if err != nil {
		return err
	}
	return nil
}

func (repositoryCurrency CurrencyRepository) FindOne(code string) (models.Currency, error) {
	filter := bson.D{{Key: "code", Value: code}}
	var result models.Currency

	err := repositoryCurrency.collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Currency{}, err
		}
	}
	return result, nil
}

func (repositoryCurrency CurrencyRepository) Delete(code string) (int64, error) {
	filter := bson.D{{Key: "code", Value: code}}

	result, err := repositoryCurrency.collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return 0, err
	}

	return result.DeletedCount, nil
}

func (repositoryCurrency CurrencyRepository) CreateCurrenciesFromApi(currencies []models.Currency) error {
	for _, currency := range currencies {
		filter := bson.D{{Key: "code", Value: bson.M{"$eq": currency.Code}}}
		update := bson.M{
			"$set": bson.M{
				"code": currency.Code,
				"bid":  currency.Bid,
			},
		}
		opts := options.Update().SetUpsert(true)
		result, err := repositoryCurrency.collection.UpdateOne(context.TODO(), filter, update, opts)
		if err != nil {
			return err
		}
		fmt.Printf("Currency %s foi atualizada com sucesso: id %v\n", currency.Code, result.UpsertedID)
	}

	return nil
}
