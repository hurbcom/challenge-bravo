package server

import (
	"fmt"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/controller"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server/currency"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"net"
	"strconv"
)

type Server struct {
	listener net.Listener
	server   *grpc.Server
	port     int
}

func New(port int, cntroller controller.Controller) (*Server, error) {
	l, err := net.Listen("tcp", ":"+strconv.Itoa(port))
	if err != nil {
		return nil, errors.Wrap(err, "server failed to start listening")
	}
	currencyServer := currency.NewCurrencyServer(cntroller)
	grpcServer := grpc.NewServer()
	currency.RegisterCurrencyServiceServer(grpcServer, currencyServer)
	return &Server{
		listener: l,
		server:   grpcServer,
		port:     port,
	}, nil
}

// It starts the gRPC server
func (s *Server) Run() <-chan error {
	var chErr chan error
	log.Infoln(fmt.Sprintf("gRPC server has started at port %d", s.port))
	go func() {
		if err := s.server.Serve(s.listener); err != nil {
			chErr <- err
		}
	}()
	return chErr
}

// It closes the gRPC server
func (s *Server) Close() {
	log.Infoln("gRPC server shutdown")
	s.server.GracefulStop()
}
