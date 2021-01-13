package currency

import (
	"testing"

	. "github.com/onsi/gomega"
)

func TestInitUpdater(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
}

func TestNewCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
	err = currency.NewCurrency("AUD")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := currency.GetAllCurrencies()
	g.Expect(currencies["AUD"]).ShouldNot(BeNil())
}

func TestNewExistsCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
	err = currency.NewCurrency("USD")
	g.Expect(err).ShouldNot(BeNil())
}

func TestAddDuplicateCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
	err = currency.NewCurrency("AUD")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := currency.GetAllCurrencies()
	g.Expect(currencies["AUD"]).ShouldNot(BeNil())
	err = currency.NewCurrency("AUD")
	g.Expect(err).ShouldNot(BeNil())
}

func TestNewNonexistentCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
	err = currency.NewCurrency("AAA")
	g.Expect(err).ShouldNot(BeNil())
}

func TestDeleteCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	currency, err := Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(currency).ShouldNot(BeNil())
	err = currency.DeleteCurrency("BRL")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := currency.GetAllCurrencies()
	g.Expect(currencies["BRL"]).Should(BeZero())
}
