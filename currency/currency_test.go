package currency

import (
	. "github.com/onsi/gomega"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"strconv"
	"testing"
)

func TestCurrency(t *testing.T) {
	g := NewGomegaWithT(t)
	matchCurrencies := getLatestCurrencies(g)
	btcCurrency := getLatestBtcCurrency(g)

	sut, err := NewCurrency()
	g.Expect(err).ShouldNot(HaveOccurred())

	t.Run("usd currency", func(t *testing.T) {
		usdCurrency, err := sut.Currency("USD")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.USD").Float()).Should(BeEquivalentTo(usdCurrency))
	})

	t.Run("eur currency", func(t *testing.T) {
		eurCurrency, err := sut.Currency("EUR")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.EUR").Float()).Should(BeEquivalentTo(eurCurrency))
	})

	t.Run("brl currency", func(t *testing.T) {
		brlCurrency, err := sut.Currency("BRL")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.BRL").Float()).Should(BeEquivalentTo(brlCurrency))
	})

	t.Run("btc currency", func(t *testing.T) {
		btc, err := sut.Currency("BTC")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(btcCurrency).Should(BeEquivalentTo(btc))
	})

	t.Run("eth currency", func(t *testing.T) {
		ethCurrency, err := sut.Currency("ETH")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.ETH").Float()).Should(BeEquivalentTo(ethCurrency))
	})

	t.Run("cad currency", func(t *testing.T) {
		cadCurrency, err := sut.Currency("CAD")

		g.Expect(err).Should(HaveOccurred())
		g.Expect(err).Should(MatchError(ErrCurrencyNotExist))
		g.Expect(cadCurrency).Should(BeEquivalentTo(0))
	})

	t.Run("usd lower case currency", func(t *testing.T) {
		usdCurrency, err := sut.Currency("usd")

		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.USD").Float()).Should(BeEquivalentTo(usdCurrency))
	})

	t.Run("adding new currency", func(t *testing.T) {
		err := sut.AddCurrency("CAD")

		g.Expect(err).ShouldNot(HaveOccurred())
		cadCurrency, err := sut.Currency("CAD")
		g.Expect(err).ShouldNot(HaveOccurred())
		g.Expect(gjson.Get(matchCurrencies, "rates.CAD").Float()).Should(BeEquivalentTo(cadCurrency))
	})

	t.Run("deleting new currency", func(t *testing.T) {
		sut.DeleteCurrency("BRL")

		brlCurrency, err := sut.Currency("BRL")
		g.Expect(err).Should(HaveOccurred())
		g.Expect(err).Should(MatchError(ErrCurrencyNotExist))
		g.Expect(brlCurrency).Should(BeEquivalentTo(0))
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

func getLatestBtcCurrency(g *GomegaWithT) float64 {
	resp, err := http.Get(btcHost)
	g.Expect(err).ShouldNot(HaveOccurred())
	body, err := ioutil.ReadAll(resp.Body)
	g.Expect(err).ShouldNot(HaveOccurred())
	btc, err := strconv.ParseFloat(string(body), 64)
	g.Expect(err).ShouldNot(HaveOccurred())
	return btc
}
