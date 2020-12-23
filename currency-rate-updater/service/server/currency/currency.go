package currency

import (
	"context"
)

type Server struct {
}

func NewCurrencyServer() *Server {
	// TODO Receive and save controller to the struct
	return new(Server)
}

// gRPC service to add a new currency to the service
func (s *Server) AddCurrency(ctx context.Context, req *Request) (*Response, error) {
	// TODO Insert AddCurrency from controller here
	return &Response{
		Success: true,
	}, nil
}

// gRPC service to remove a new currency to the service
func (s *Server) RemoveCurrency(ctx context.Context, req *Request) (*Response, error) {
	// TODO Insert RemoveCurrency from controller here
	return &Response{
		Success: true,
	}, nil
}
