package hurb

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongodb struct {
	client *mongo.Client
	ctx    context.Context
	close  func()
}

func (m *mongodb) listCurr() (map[string]currency, error) {
	database := m.client.Database("hurb-challenge")
	currCollection := database.Collection("currencies")
	cursor, err := currCollection.Find(m.ctx, bson.M{})
	if err != nil {
		return map[string]currency{}, err
	}
	var currList []bson.M
	if err = cursor.All(m.ctx, &currList); err != nil {
		log.Fatal(err)
	}
	output := map[string]currency{}
	for i := range currList {
		isCrypto, _ := strconv.ParseBool(fmt.Sprint(currList[i]["is_crypto"]))
		output[fmt.Sprint(currList[i]["name"])] = currency{name: fmt.Sprint(currList[i]["name"]), crypto: isCrypto}
	}
	return output, nil
}

func (m *mongodb) rmCurr(curr currency) error {
	log.Printf("removing %s from support list", curr.name)
	database := m.client.Database("hurb-challenge")
	currList := database.Collection("currencies")
	result, err := currList.DeleteOne(m.ctx, bson.M{
		"name": curr.name,
	})
	if err != nil {
		return fmt.Errorf("DeleteOne err: %v", err)
	}
	log.Printf("successfully removed %d %s from support list", result.DeletedCount, curr.name)
	return nil
}

func (m *mongodb) addCurr(curr currency) error {
	log.Printf("adding %s to support list", curr.name)
	database := m.client.Database("hurb-challenge")
	currList := database.Collection("currencies")
	result, err := currList.InsertOne(m.ctx, bson.D{
		{Key: "name", Value: curr.name},
		{Key: "is_crypto", Value: curr.crypto},
	})
	if err != nil {
		return fmt.Errorf("InsertOne err: %v", err)
	}
	log.Printf("successfully added %s to support list with %v id", curr.name, result.InsertedID)
	return nil
}

func newMongoClient() (mongodb, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://hurb:randomhze3185JFK@hurb-challenge.qkuww.mongodb.net/hurb?retryWrites=true&w=majority"))
	if err != nil {
		return mongodb{close: func() {}}, err
	}

	ctx, close := context.WithTimeout(context.Background(), 20*time.Second)

	err = client.Connect(ctx)
	if err != nil {
		close()
		return mongodb{close: func() {}}, err
	}

	return mongodb{client: client, close: func() {
		close()
		client.Disconnect(ctx)
	}}, nil
}
