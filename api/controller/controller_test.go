package controller

import (
	"challenge-bravo-1/api/currency"
	"testing"

	. "github.com/onsi/gomega"
)

func TestNewController(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
}

func TestNewCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
	err = col.NewCurrency("AUD")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := col.GetAllCurrencies()
	g.Expect(currencies["AUD"]).ShouldNot(BeNil())
}

func TestNewExistsCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
	err = col.NewCurrency("USD")
	g.Expect(err).ShouldNot(BeNil())
}

func TestAddDuplicateCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
	err = col.NewCurrency("AUD")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := col.GetAllCurrencies()
	g.Expect(currencies["AUD"]).ShouldNot(BeNil())
	err = col.NewCurrency("AUD")
	g.Expect(err).ShouldNot(BeNil())
}

func TestNewNonexistentCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
	err = col.NewCurrency("AAA")
	g.Expect(err).ShouldNot(BeNil())
}

func TestDeleteCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	curr, err := currency.Init()
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(curr).ShouldNot(BeNil())
	col := NewController(curr)
	g.Expect(col).ShouldNot(BeNil())
	err = col.DeleteCurrency("BRL")
	g.Expect(err).ShouldNot(HaveOccurred())
	currencies := col.GetAllCurrencies()
	g.Expect(currencies["BRL"]).Should(BeZero())
}
