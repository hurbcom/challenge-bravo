package api

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/action"
	"github.com/joaohgf/challenge-bravo/internal/repository"
)

// Server struct for api
type Server struct {
	Repository *repository.Engine
	Action     action.Action
}

// NewServer creates a new server
func NewServer(ctx context.Context) *Server {
	// create the engine of the repository
	var engine = repository.NewEngine(ctx)
	// create the action to be used by the server be initialized with
	// data on repositories
	return &Server{Repository: engine, Action: action.NewUpdate(engine)}
}

// Run runs the server
func (s *Server) Run(ctx context.Context) error {
	var r = s.Routes()
	// run the action to update the currency
	go s.Action.Act(ctx)
	// run the server
	var err = r.Run(":8080")
	if err != nil {
		return err
	}
	return nil
}
