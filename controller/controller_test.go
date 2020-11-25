package controller

import (
	"github.com/ednailson/challenge-bravo/currency"
	. "github.com/onsi/gomega"
	"testing"
)

func TestController(t *testing.T) {
	g := NewGomegaWithT(t)
	currencyModule, err := currency.NewCurrency()
	g.Expect(err).ShouldNot(HaveOccurred())

	sut := NewController(currencyModule)

	t.Run("convert from eur to brl", func(t *testing.T) {
		convertedValue, err := sut.Convert("EUR", "BRL", 100)

		g.Expect(err).ShouldNot(HaveOccurred())
		eurCurrency, err := currencyModule.Currency("EUR")
		g.Expect(err).ShouldNot(HaveOccurred())
		brlCurrency, err := currencyModule.Currency("BRL")
		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(convertedValue).Should(BeEquivalentTo(((1 / eurCurrency) * brlCurrency) * 100))
	})

	t.Run("convert from invalid currency", func(t *testing.T) {
		convertedValue, err := sut.Convert("INVALID", "BRL", 100)

		g.Expect(err).Should(HaveOccurred())
		g.Expect(convertedValue).Should(BeEquivalentTo(0))
	})
}
