package main

import (
	service "challenge-bravo/Service"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func BenchmarkMain(b *testing.B) {
	// inicia qualquer coisa q precisa pro service funcionar...

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			from, to, amount, error := service.ValidPost(r)
			if error != "" {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("Please, fill the " + strings.ToUpper(error) + " field"))
				return
			}

			result := service.GetValue(from, to, amount)

			if result > 0 {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("Result: " + fmt.Sprintf("%f", result)))
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
		greeting, err := ioutil.ReadAll(res.Body)
		res.Body.Close()
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("%s", greeting)
	}
}
