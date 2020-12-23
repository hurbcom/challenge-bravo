package service

import (
	"context"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/cache"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/controller"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/currency"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"time"
)

type Service struct {
	grpcServer    *server.Server
	cntroller     controller.Controller
	updaterCancel context.CancelFunc
	pullingTime   time.Duration
}

func New(c *Config) (*Service, error) {
	service := Service{}
	pullingTime, err := time.ParseDuration(c.PullingTime)
	if err != nil {
		return nil, errors.Wrap(err, "invalid pulling time")
	}
	service.pullingTime = pullingTime
	cacheModule, err := cache.New(c.Cache)
	if err != nil {
		return nil, err
	}
	currencyModule := currency.New("https://api.exchangerate.host/latest?source=crypto&base=USD")
	service.cntroller = controller.New(cacheModule, currencyModule, c.AllowedCurrencies)
	service.grpcServer, _ = server.New(c.ServerPort, service.cntroller)
	return &service, nil
}

func (s *Service) Run() <-chan error {
	ctx, cancel := context.WithCancel(context.Background())
	s.updaterCancel = cancel
	go func() {
		for {
			select {
			case <-ctx.Done():
				break
			default:
				if err := s.cntroller.UpdateCurrencies(); err != nil {
					log.Errorln(err)
				}
				time.Sleep(s.pullingTime)
			}
		}
	}()
	return s.grpcServer.Run()
}

func (s *Service) Shutdown() {
	s.updaterCancel()
	s.grpcServer.Close()
}
