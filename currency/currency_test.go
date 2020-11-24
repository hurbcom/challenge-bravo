package currency

import (
	. "github.com/onsi/gomega"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"testing"
)

func TestCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	matchCurrencies := getLatestCurrencies(g)

	sut, err := NewCurrency()
	g.Expect(err).ShouldNot(HaveOccurred())

	t.Run("dollar currency", func(t *testing.T) {
		g.Expect(gjson.Get(matchCurrencies, "rates.USD").Float()).Should(BeEquivalentTo(sut.USD()))
	})

	t.Run("euro currency", func(t *testing.T) {
		g.Expect(gjson.Get(matchCurrencies, "rates.EUR").Float()).Should(BeEquivalentTo(sut.EUR()))
	})
}

func getLatestCurrencies(g *GomegaWithT) string {
	resp, err := http.Get(host)
	g.Expect(err).ShouldNot(HaveOccurred())
	g.Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
	body, err := ioutil.ReadAll(resp.Body)
	g.Expect(err).ShouldNot(HaveOccurred())
	return string(body)
}

