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
	g.Expect(gjson.Get(string(body), "data.value").Float()).Should(BeEquivalentTo(((1 / currencyModule.USD()) * currencyModule.EUR()) * 123.45))
}
