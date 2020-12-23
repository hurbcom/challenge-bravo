package server

import (
	"context"
	"errors"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server/currency"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc"
	"testing"
)

func TestServer(t *testing.T) {
	RegisterTestingT(t)
	cntroller := &MockController{}
	srv, err := New(45000, cntroller)
	Expect(err).ShouldNot(HaveOccurred())
	srv.Run()
	defer srv.Close()
	conn, err := grpc.Dial(":45000", grpc.WithInsecure(), grpc.WithBlock())
	Expect(err).ShouldNot(HaveOccurred())
	defer conn.Close()
	client := currency.NewCurrencyServiceClient(conn)
	t.Run("It adds a new currency", func(t *testing.T) {
		cntroller.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return nil
		}
		req := &currency.Request{Code: "USD"}
		resp, err := client.AddCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
	})
	t.Run("It adds a new currency with failure", func(t *testing.T) {
		cntroller.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return errors.New("failed")
		}
		req := &currency.Request{Code: "USD"}
		resp, err := client.AddCurrency(context.Background(), req)
		Expect(err).Should(HaveOccurred())
		Expect(resp).Should(BeNil())
	})
	t.Run("It removes a currency", func(t *testing.T) {
		cntroller.removeCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return nil
		}
		req := &currency.Request{Code: "USD"}
		resp, err := client.RemoveCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
	})
	t.Run("It removes a currency with failure", func(t *testing.T) {
		cntroller.removeCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return errors.New("failed")
		}
		req := &currency.Request{Code: "USD"}
		resp, err := client.RemoveCurrency(context.Background(), req)
		Expect(err).Should(HaveOccurred())
		Expect(resp).Should(BeNil())
	})
}

type MockController struct {
	addCurrencyFunc    func(code string) error
	removeCurrencyFunc func(code string) error
}

func (m *MockController) AddCurrency(code string) error {
	return m.addCurrencyFunc(code)
}
func (m *MockController) RemoveCurrency(code string) error {
	return m.removeCurrencyFunc(code)
}
func (m *MockController) UpdateCurrencies() error {
	return nil
}
func (m *MockController) GetAllowedCurrencies() []string {
	return nil
}
