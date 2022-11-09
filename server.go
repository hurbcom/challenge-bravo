package main

import (
	"log"
	"net/http"

	"github.com/victorananias/challenge-bravo/helpers"
)

type Server struct {
}

func (server *Server) Start() {
	log.Printf("Server started at port %s", helpers.Env.AppPort)
	err := http.ListenAndServe(":"+helpers.Env.AppPort, nil)
	log.Fatal(err)
}
