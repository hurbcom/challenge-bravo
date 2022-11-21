package main

import (
	"log"
	"net/http"

	"github.com/Ricardo-Sales/challenge-bravo/routers"
)

func main() {
	router := routers.Generate()

	log.Fatal(http.ListenAndServe(":8000", router))
}
