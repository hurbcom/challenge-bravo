package main

import (
	"github.com/felipepnascimento/api-go-gin/database"
	"github.com/felipepnascimento/api-go-gin/routes"
)

func main() {
	database.ConectaComBancoDeDados()
	routes.HandleRequests()
}
