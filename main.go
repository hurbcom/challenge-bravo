package main

import (
	"fmt"
	"github.com/gustavowiller/challengebravo/database"
)

func main() {
	database.RunMigrations()
	fmt.Println("Desafio Bravo - Hurb")
}
