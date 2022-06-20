package main

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/api"
	"github.com/joaohgf/challenge-bravo/internal/job"
	"log"
)

// main is the entry point of the application
func main() {
	// main context of application
	var ctx = context.Background()
	// create the server
	var server = api.NewServer(ctx)
	// create the job
	jobs := job.NewJob(server.Repository)
	go jobs.Run(ctx)
	var err = server.Run(ctx)
	if err != nil {
		log.Fatalln(err)
	}
}
