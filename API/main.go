package main

import (
	"api/src/config"
	"api/src/controllers"
	"api/src/cronjobs"
	"api/src/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.Load()
	router := router.Generate()
	controllers.InitRedisDatabase()

	go cronjobs.RunCronjob()

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.ApiPort), router))
}
