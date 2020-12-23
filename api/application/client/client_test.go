package client

import (
	"context"
	"errors"
	"github.com/iiurydias/challenge-bravo/api/application/client/currency"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc"
	"net"
	"testing"
)

func TestServer(t *testing.T) {
	RegisterTestingT(t)
	l, err := net.Listen("tcp", ":4501")
	Expect(err).ShouldNot(HaveOccurred())
	currencyServer := &MockServer{}
	grpcServer := grpc.NewServer()
	currency.RegisterCurrencyServiceServer(grpcServer, currencyServer)
	go func() {
		grpcServer.Serve(l)
	}()
	defer grpcServer.GracefulStop()
	grpcClient, err := New(Config{
		Host: "localhost",
		Port: 4501,
	})
	Expect(err).ShouldNot(HaveOccurred())
	t.Run("It adds a new currency", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("USD"))
			return &currency.Response{Success: true}, nil
		}
		err := grpcClient.AddCurrency("USD")
		Expect(err).ShouldNot(HaveOccurred())
	})
	t.Run("It adds a new currency with failure", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("USD"))
			return nil, errors.New("failed")
		}
		err := grpcClient.AddCurrency("USD")
		Expect(err).Should(HaveOccurred())
	})
	t.Run("It removes a currency", func(t *testing.T) {
		currencyServer.removeCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("USD"))
			return &currency.Response{Success: true}, nil
		}
		err := grpcClient.RemoveCurrency("USD")
		Expect(err).ShouldNot(HaveOccurred())
	})
	t.Run("It removes a currency with failure", func(t *testing.T) {
		currencyServer.removeCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("USD"))
			return nil, errors.New("failed")
		}
		err := grpcClient.RemoveCurrency("USD")
		Expect(err).Should(HaveOccurred())
	})
}

type MockServer struct {
	addCurrencyFunc    func(ctx context.Context, req *currency.Request) (*currency.Response, error)
	removeCurrencyFunc func(ctx context.Context, req *currency.Request) (*currency.Response, error)
}

func (m *MockServer) AddCurrency(ctx context.Context, req *currency.Request) (*currency.Response, error) {
	return m.addCurrencyFunc(ctx, req)
}

func (m *MockServer) RemoveCurrency(ctx context.Context, req *currency.Request) (*currency.Response, error) {
	return m.removeCurrencyFunc(ctx, req)
}
