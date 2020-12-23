package client

import (
	"context"
	"fmt"
	"github.com/iiurydias/challenge-bravo/api/application/client/currency"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
)

type client struct {
	client currency.CurrencyServiceClient
}

func New(cfg Config) (Client, error) {
	conn, err := grpc.Dial(fmt.Sprintf("%s:%d", cfg.Host, cfg.Port), grpc.WithInsecure())
	if err != nil {
		return nil, errors.Wrap(err, "failed to dial with grpc server")
	}
	return &client{client: currency.NewCurrencyServiceClient(conn)}, nil
}

func (c *client) AddCurrency(code string) error {
	request := &currency.Request{Code: code}
	_, err := c.client.AddCurrency(context.Background(), request)
	if err != nil {
		return err
	}
	return nil
}

func (c *client) RemoveCurrency(code string) error {
	request := &currency.Request{Code: code}
	_, err := c.client.RemoveCurrency(context.Background(), request)
	if err != nil {
		return err
	}
	return nil
}
