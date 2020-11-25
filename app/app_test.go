package app

import (
	"github.com/ednailson/challenge-bravo/currency"
	. "github.com/onsi/gomega"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"testing"
)

func TestApp(t *testing.T) {
	g := NewGomegaWithT(t)
	sut, err := LoadApp()
	g.Expect(err).ShouldNot(HaveOccurred())
	sut.Run()
	currencyModule, err := currency.NewCurrency()
	g.Expect(err).ShouldNot(HaveOccurred())

	t.Run("converting currencies", func(t *testing.T) {
		resp, err := http.Get("http://localhost:8080/v1/convert?from=USD&to=EUR&amount=123.45")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
		body, err := ioutil.ReadAll(resp.Body)
		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(string(body), "status").String()).Should(BeEquivalentTo("success"))
		usdCurrency, err := currencyModule.Currency("USD")
		g.Expect(err).ShouldNot(HaveOccurred())
		eurCurrency, err := currencyModule.Currency("EUR")
		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(string(body), "data.result").Float()).Should(BeEquivalentTo(((1 / usdCurrency) * eurCurrency) * 123.45))
	})

	t.Run("adding cad currency", func(t *testing.T) {
		resp, err := http.Post("http://localhost:8080/v1/currency/CAD", "application/json", nil)

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
		body, err := ioutil.ReadAll(resp.Body)
		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(string(body), "status").String()).Should(BeEquivalentTo("success"))
		g.Expect(gjson.Get(string(body), "data.CAD").String()).Should(BeEquivalentTo("CAD has been added"))
	})

	t.Run("deleting cad currency", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodDelete, "http://localhost:8080/v1/currency/USD", nil)
		g.Expect(err).ShouldNot(HaveOccurred())
		resp, err := http.DefaultClient.Do(req)

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNoContent))
	})
}
