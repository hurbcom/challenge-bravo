package main

import (
	"fmt"
	"github.com/gustavowiller/challengebravo/database"
)

func main() {
	database.Connect()
	fmt.Println("Desafio Bravo - Hurb")
}
