package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var (
	currencies = []currency{
		{name: "USD", isCrytpo: false},
		{name: "BRL", isCrytpo: false},
		{name: "EUR", isCrytpo: false},
		{name: "BTC", isCrytpo: true},
		{name: "ETH", isCrytpo: true},
	}
)

type mongodb struct {
	client *mongo.Client
	ctx    context.Context
	close  func()
}

type currency struct {
	name     string
	isCrytpo bool
}

func main() {
	m, err := newMongoClient()
	if err != nil {
		log.Fatalf("newMongoClient err: %v", err)
	}
	defer m.close()

	err = m.client.Ping(m.ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}

	err = m.fillDB()
	if err != nil {
		log.Fatal(err)
	}

	err = m.checkDB()
	if err != nil {
		log.Fatal(err)
	}
}

func (m *mongodb) checkDB() error {
	databases, err := m.client.ListDatabaseNames(m.ctx, bson.M{})
	if err != nil {
		return fmt.Errorf("ListDatabaseNames err: %v", err)
	}
	log.Printf("%+v\n", databases)
	return nil
}

func (m *mongodb) fillDB() error {
	database := m.client.Database("hurb-challenge")
	currList := database.Collection("currencies")
	results := []*mongo.InsertOneResult{}
	for i := range currencies {
		result, err := currList.InsertOne(m.ctx, bson.D{
			{Key: "name", Value: currencies[i].name},
		})
		if err != nil {
			return fmt.Errorf("InsertOne err: %v", err)
		}
		results = append(results, result)
	}
	for i := range results {
		log.Printf("%+v", results[i])
	}
	return nil
}

func newMongoClient() (mongodb, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://hurb:randomhze3185JFK@localhost:28017"))
	if err != nil {
		return mongodb{}, err
	}

	ctx, close := context.WithTimeout(context.Background(), 20*time.Second)

	err = client.Connect(ctx)
	if err != nil {
		close()
		return mongodb{}, err
	}

	return mongodb{client: client, close: func() {
		close()
		client.Disconnect(ctx)
	}}, nil
}
