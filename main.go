package main

import (
	"net/http"

	"github.com/bispoman/challenge-bravo/models"
	"github.com/bispoman/challenge-bravo/route"
	log "github.com/sirupsen/logrus"
)

func main() {

	log.Info("Starting database phase")

	models.PopulateDb()

	log.Info("Database phase ended")

	log.Info("Application has been started on : 8080")

	routes := route.GetRoutes()

	http.Handle("/", routes)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
