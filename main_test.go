package main

import (
	service "challenge-bravo/Service"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/shopspring/decimal"
)

func BenchmarkMain(b *testing.B) {
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			form, _ := url.ParseQuery(r.URL.RawQuery)
			form.Add("from", "brl")
			form.Add("to", "usd")
			form.Add("amount", "15")

			r.URL.RawQuery = form.Encode()

			from, to, amount, error := service.ValidPost(r)
			if error != "" {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("Please, fill the " + strings.ToUpper(error) + " field"))
				return
			}

			result := service.GetValue(from, to, amount)

			if result.GreaterThan(decimal.NewFromFloat(0)) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("Result: " + result.StringFixedCash(5)))

				return
			}

			w.WriteHeader(http.StatusInternalServerError)
			return
		}))
		defer ts.Close()

		res, err := http.Get(ts.URL)
		if err != nil {
			log.Fatal(err)
		}
		resp, err := ioutil.ReadAll(res.Body)
		res.Body.Close()
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("%s", resp)
	}
}
