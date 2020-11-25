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
		g.Expect(((1 / currencyModule.EUR()) * currencyModule.BRL()) * 100).Should(BeEquivalentTo(convertedValue))
	})
}
