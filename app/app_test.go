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
}
