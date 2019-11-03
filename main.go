package main

import (
	"context"
	"net/http"

	"github.com/bispoman/challenge-bravo/route"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	//connecting bits to mongodb
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

	log.Info("Application has been started on : 8080")

	routes := route.GetRoutes()

	http.Handle("/", routes)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
