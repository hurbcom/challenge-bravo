package main

import (
	"challenge-bravo/conversion-api/currency/gateway"
	"challenge-bravo/conversion-api/currency/repository"
	conversion_http "challenge-bravo/conversion-api/currency/server/http"
	"challenge-bravo/conversion-api/currency/service"
	"fmt"
	"github.com/go-chi/chi"
	"net/http"
	"os"
)

func main() {
	fmt.Println("Starting API...")
	fmt.Println("Connecting to Database...")
	repo, err := repository.NewRepository()

	if err != nil {
		fmt.Println("Error Connecting to Database: ", err)
		os.Exit(0)
	}

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
