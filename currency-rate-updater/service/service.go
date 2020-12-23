package service

import (
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server"
)

type Service struct {
	grpcServer *server.Server
}

func New(c *Config) (*Service, error) {
	service := Service{}
	service.grpcServer, _ = server.New(3000)
	return &service, nil
}

func (s *Service) Run() <-chan error {
	return s.grpcServer.Run()
}

func (s *Service) Shutdown() {
	s.grpcServer.Close()
}
