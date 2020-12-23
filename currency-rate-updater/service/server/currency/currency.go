package currency

import (
	"context"
	"fmt"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/controller"
	log "github.com/sirupsen/logrus"
	"strings"
)

type Server struct {
	cntroller controller.Controller
}

func NewCurrencyServer(cntroller controller.Controller) *Server {
	return &Server{cntroller: cntroller}
}

// gRPC service to add a new currency to the service
func (s *Server) AddCurrency(ctx context.Context, req *Request) (*Response, error) {
	code := strings.ToUpper(req.Code)
	err := s.cntroller.AddCurrency(code)
	if err != nil {
		return nil, err
	}
	log.Info(fmt.Sprintf("currency %s was added successfully", code))
	return &Response{
		Success: true,
	}, nil
}

// gRPC service to remove a new currency to the service
func (s *Server) RemoveCurrency(ctx context.Context, req *Request) (*Response, error) {
	code := strings.ToUpper(req.Code)
	err := s.cntroller.RemoveCurrency(code)
	if err != nil {
		return nil, err
	}
	log.Info(fmt.Sprintf("currency %s was removed successfully", code))
	return &Response{
		Success: true,
	}, nil
}
