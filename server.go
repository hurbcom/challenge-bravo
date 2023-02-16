package main

import (
	"fmt"
	"net/http"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/handler"
	"github.com/hashicorp/go-hclog"
)

func main() {
	serverAddr := ":9000"

	log := hclog.Default()

	router := handler.NewMuxRouter()

	router.Get("/currency", root)

	log.Info(fmt.Sprintf("HTTP server running on port %v", serverAddr))

	err := http.ListenAndServe(serverAddr, handler.HttpLogger(router.Serve(), log))

	if err != nil {
		log.Error("Error running HTTP server", err)
	}
}

func root(rw http.ResponseWriter, req *http.Request) {
	rw.Write([]byte("hello word"))
}
