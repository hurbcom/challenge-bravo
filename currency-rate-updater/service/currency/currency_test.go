package currency

import (
	. "github.com/onsi/gomega"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetValidCurrencyRate(t *testing.T) {
	RegisterTestingT(t)
	ts := httptest.NewServer(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Content-Type", "application/json")
			w.Write([]byte(`{"rates":{"EUR":53.5}}`))
		}),
	)
	defer ts.Close()
	curr := New(ts.URL)
	value, err := curr.GetCurrencyRate("EUR")
	Expect(err).ShouldNot(HaveOccurred())
	Expect(value).Should(BeEquivalentTo(53.5))
}

func TestGetNonexistentCurrencyRate(t *testing.T) {
	RegisterTestingT(t)
	ts := httptest.NewServer(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Content-Type", "application/json")
			w.Write([]byte(`{"rates":{"EUR":53.5}}`))
		}),
	)
	defer ts.Close()
	curr := New(ts.URL)
	value, err := curr.GetCurrencyRate("BRL")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("currency does not exist"))
	Expect(value).Should(BeZero())
}

func TestGetCurrencyRateWithFailure(t *testing.T) {
	RegisterTestingT(t)
	ts := httptest.NewServer(nil)
	ts.Close()
	curr := New(ts.URL)
	value, err := curr.GetCurrencyRate("EUR")
	Expect(err).Should(HaveOccurred())
	Expect(value).Should(BeZero())
}

func TestGetAllCurrenciesRate(t *testing.T) {
	RegisterTestingT(t)
	ts := httptest.NewServer(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Content-Type", "application/json")
			w.Write([]byte(`{"rates":{"EUR":53.5,"BRL":2.3,"USD":5.2}}`))
		}),
	)
	defer ts.Close()
	curr := New(ts.URL)
	currencies, err := curr.GetAllCurrenciesRate()
	Expect(err).ShouldNot(HaveOccurred())
	Expect(currencies).Should(BeEquivalentTo(map[string]float64{"EUR": 53.5, "BRL": 2.3, "USD": 5.2}))
}

func TestGetAllCurrenciesRateWithFailure(t *testing.T) {
	RegisterTestingT(t)
	ts := httptest.NewServer(nil)
	ts.Close()
	curr := New(ts.URL)
	currencies, err := curr.GetAllCurrenciesRate()
	Expect(err).Should(HaveOccurred())
	Expect(currencies).Should(BeNil())
}
