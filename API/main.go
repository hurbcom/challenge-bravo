package main

import (
	"api/src/config"
	"api/src/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.Load()
	router := router.Generate()

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.ApiPort), router))
}
