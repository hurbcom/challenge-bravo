package main

import (
	"github.com/felipepnascimento/challenge-bravo-flp/database"
	"github.com/felipepnascimento/challenge-bravo-flp/routes"
)

func main() {
	database.ConnectDatabase()
	routes.HandleRequests()
}
