package models

import (
	"context"

	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Currency struct {
	Currency string
	Rate     float64
}

func PopulateDb() {
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
	log.Info("Connected to mongodb @ localhost:27017")

	collection := client.Database("test").Collection("currencies")

	//Cleaning Database
	deleteResult, err := collection.DeleteMany(context.TODO(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}
	log.Info("Deleted %v documents in the currencies collection", deleteResult.DeletedCount)

	//creating currencies to add to the Database
	usd := Currency{"USD", 1}
	brl := Currency{"BRL", 0.25}
	eur := Currency{"EUR", 1.12}
	btc := Currency{"EUR", 9353.2}
	eth := Currency{"ETH", 183.21}

	//currencies array
	currenciesArray := []interface{}{usd, brl, eur, btc, eth}

	insertResult, err := collection.InsertMany(context.TODO(), currenciesArray)
	if err != nil {
		log.Fatal(err)
	}
	log.Info("Inserted multiple documents: ", insertResult.InsertedIDs)
}
