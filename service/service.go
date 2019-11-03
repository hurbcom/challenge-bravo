package service

import (
	"context"
	"log"

	"github.com/bispoman/challenge-bravo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getCurrencyfromDB(currencyName string) models.Currency {

	//mongodb connection bits
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	//trying to connect
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	//checking connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("test").Collection("currencies")

	filter := bson.D{primitive.E{Key: "name", Value: currencyName}}

	var result models.Currency

	err = collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}
	client.Disconnect(context.Background())

	return result
}

func MathConvert(f string, t string, a float64) float64 {
	fromCurrency := getCurrencyfromDB(f)
	toCurrency := getCurrencyfromDB(t)
	if fromCurrency.Rate == 0 {
		return 0
	}
	liqFrom := a / fromCurrency.Rate
	return toCurrency.Rate * liqFrom
}
