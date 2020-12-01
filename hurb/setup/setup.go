package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ozzono/challenge-bravo/hurb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var (
	currencies = []currency{
		{name: "USD", isCrypto: false},
		{name: "BRL", isCrypto: false},
		{name: "EUR", isCrypto: false},
		{name: "BTC", isCrypto: true},
		{name: "ETH", isCrypto: true},
	}
)

type mongodb struct {
	client *mongo.Client
	ctx    context.Context
	close  func()
}

type currency struct {
	name     string
	isCrypto bool
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

	err = hurb.StartServer()
	if err != nil {
		log.Fatal(err)
	}
}

func (m *mongodb) findDB(dbName string) (mongo.DatabaseSpecification, error) {
	databases, err := m.client.ListDatabases(m.ctx, bson.M{})
	if err != nil {
		return mongo.DatabaseSpecification{}, fmt.Errorf("ListDatabaseNames err: %v", err)
	}
	mapDB := map[string]mongo.DatabaseSpecification{}
	for _, db := range databases.Databases {
		mapDB[db.Name] = db
	}
	_, ok := mapDB[dbName]
	if !ok {
		return mongo.DatabaseSpecification{}, fmt.Errorf("%s database not found", dbName)
	}

	return mapDB[dbName], nil
}

func (m *mongodb) fillDB() error {
	database := m.client.Database("hurb-challenge")
	collections, err := database.ListCollectionNames(m.ctx, bson.M{})
	if err != nil {
		return fmt.Errorf("ListCollectionNames err: %v", err)
	}
	for i := range collections {
		if collections[i] == "currencies" {
			log.Println("This script will drop the currencies database")
			waitEnter()
			err = database.Collection("currencies").Drop(m.ctx)
			if err != nil {
				return fmt.Errorf("Collection err: %v", err)
			}
		}
	}

	currList := database.Collection("currencies")
	results := []*mongo.InsertOneResult{}
	for i := range currencies {
		log.Printf("name: % 4s crypto: %t", currencies[i].name, currencies[i].isCrypto)
		result, err := currList.InsertOne(m.ctx, bson.D{
			{Key: "name", Value: currencies[i].name},
			{Key: "is_crypto", Value: currencies[i].isCrypto},
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
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://hurb:randomhze3185JFK@hurb-challenge.qkuww.mongodb.net/hurb?retryWrites=true&w=majority"))
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

func waitEnter() {
	log.Printf("Press <enter> to continue or <ctrl+c> to interrupt")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	log.Printf("Now, where was I?")
	log.Printf("Oh yes...\n\n")
}
