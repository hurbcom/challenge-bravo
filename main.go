package main

import (
	"challenge-bravo/server"
	"challenge-bravo/server/db"
	"log"
)

func main() {
	log.Printf("Starting server...")

	port := "8080"

	// Starts database connection
	db.Init()
	defer db.Connection.Close()

	log.Printf("Server started on port %s\n\n", port)

	server.Run(port)
}
