package currency

import (
	"context"
	"fmt"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/controller"
	customErrors "github.com/iiurydias/challenge-bravo/currency-rate-updater/service/errors"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
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
		if err == customErrors.ErrCurrencyAlreadyExist {
			return nil, status.Error(codes.AlreadyExists, customErrors.ErrCurrencyAlreadyExist.Error())
		}
		if err == customErrors.ErrInvalidCurrency {
			return nil, status.Error(codes.InvalidArgument, customErrors.ErrInvalidCurrency.Error())
		}
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
		if err == customErrors.ErrCurrencyNotFound {
			return nil, status.Error(codes.NotFound, customErrors.ErrCurrencyNotFound.Error())
		}
		return nil, err
	}
	log.Info(fmt.Sprintf("currency %s was removed successfully", code))
	return &Response{
		Success: true,
	}, nil
}
