package main

import (
	"conversion-api/currency"
	"conversion-api/currency/gateway"
	"conversion-api/currency/repository"
	conversion_http "conversion-api/currency/server/http"
	"conversion-api/currency/service"
	"fmt"
	"github.com/tinrab/retry"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
)

func main() {
	fmt.Println("Starting API...")
	fmt.Println("Connecting to Database...")
	var repo currency.Repository

	retry.ForeverSleep(2*time.Second, func(_ int) (err error) {
		repo, err = repository.NewRepository()
		if err != nil {
			fmt.Println("Error Connecting to Database: ", err)
			os.Exit(1)
		}
		return
	})

	fmt.Println("Database Connected!")

	fmt.Println("Opening the Gateway...")
	gate := gateway.NewGateway()
	fmt.Println("Gateway Opened!")

	fmt.Println("Starting the Service...")
	service := service.NewService(repo, gate)
	fmt.Println("Service Started!")

	fmt.Println("Starting the Router...")
	r := chi.NewMux()
	conversion_http.NewHandler(service, r)
	fmt.Println("Router Started!")
	port := ":8081"
	fmt.Println(fmt.Sprintf("API Started! Listening on Port: %s", port))
	http.ListenAndServe(port, r)

}
