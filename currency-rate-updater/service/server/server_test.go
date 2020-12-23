package server

import (
	"context"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server/currency"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc"
	"testing"
)

func TestServer(t *testing.T) {
	RegisterTestingT(t)
	srv, err := New(45000)
	Expect(err).ShouldNot(HaveOccurred())
	srv.Run()
	defer srv.Close()
	conn, err := grpc.Dial(":45000", grpc.WithInsecure(), grpc.WithBlock())
	Expect(err).ShouldNot(HaveOccurred())
	defer conn.Close()
	client := currency.NewCurrencyServiceClient(conn)
	t.Run("It adds a new currency", func(t *testing.T) {
		req := &currency.Request{Code: "USD"}
		resp, err := client.AddCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
	})
	t.Run("It removes a currency", func(t *testing.T) {
		req := &currency.Request{Code: "USD"}
		resp, err := client.RemoveCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
	})
}
