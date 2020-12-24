package main

import (
	"bytes"
	"fmt"
	. "github.com/onsi/gomega"
	"github.com/tidwall/gjson"
	"io"
	"io/ioutil"
	"net/http"
	"testing"
)

// IT REQUIRES CONTAINERS UP THROUGH DOCKER-COMPOSE
func TestOfIntegration(t *testing.T) {
	RegisterTestingT(t)
	t.Run("it tests add a valid currency", func(t *testing.T) {
		defer deleteCurrencyAnyway("cad")
		resp := addCurrency(`{"code":"cad"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusCreated))
		Expect(body).Should(BeEquivalentTo(`{"status":"success","data":{"code":"CAD"}}`))
	})
	t.Run("it tests add a currency with invalid code type", func(t *testing.T) {
		resp := addCurrency(`{"code":1}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code has a invalid type"}}`))
	})
	t.Run("it tests add a currency with invalid json body", func(t *testing.T) {
		resp := addCurrency(`{"code":"cad"}}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"body":"invalid json body"}}`))
	})
	t.Run("it tests add a already existent currency", func(t *testing.T) {
		defer deleteCurrencyAnyway("cad")
		addCurrencySuccessfully("cad")
		resp := addCurrency(`{"code":"cad"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code already exist"}}`))
	})
	t.Run("it tests add a invalid currency", func(t *testing.T) {
		resp := addCurrency(`{"code":"cadd"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code is invalid"}}`))
	})
	t.Run("it tests add a valid currency missing code", func(t *testing.T) {
		resp := addCurrency(`{"cod":"cad"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code is a required field"}}`))
	})
	t.Run("it tests remove a currency", func(t *testing.T) {
		defer deleteCurrencyAnyway("cad")
		addCurrencySuccessfully("cad")
		resp := deleteCurrency("cad")
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNoContent))
	})
	t.Run("it tests remove a not found currency", func(t *testing.T) {
		deleteCurrencyAnyway("cad")
		resp := deleteCurrency("cad")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code not found"}}`))
	})
	t.Run("it tests convert currencies", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?from=%s&to=%s&amount=%d", "USD", "BRL", 1))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
		Expect(gjson.Get(body, "status").String()).Should(BeEquivalentTo("success"))
		Expect(gjson.Get(body, "data.from").String()).Should(BeEquivalentTo("USD"))
		Expect(gjson.Get(body, "data.to").String()).Should(BeEquivalentTo("BRL"))
		Expect(gjson.Get(body, "data.amount").Float()).Should(BeEquivalentTo(1))
		Expect(gjson.Get(body, "data.result").Float()).ShouldNot(BeZero())
	})
	t.Run("it tests convert currencies with nonexistent to currency", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?from=%s&to=%s&amount=%d", "USD", "BRLL", 1))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to currency not found"}}`))
	})
	t.Run("it tests convert currencies with nonexistent from currency", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?from=%s&to=%s&amount=%d", "USDD", "BRL", 1))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from currency not found"}}`))
	})
	t.Run("it tests convert currencies missing from currency", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?&to=%s&amount=%d", "BRL", 1))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from is a required field"}}`))
	})
	t.Run("it tests convert currencies missing to currency", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?from=%s&amount=%d", "USDD", 1))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to is a required field"}}`))
	})
	t.Run("it tests convert currencies missing amount", func(t *testing.T) {
		resp := convertCurrencies(fmt.Sprintf("?from=%s&to=%s", "USDD", "BRL"))
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"amount":"amount is a required field"}}`))
	})
}

func addCurrency(body string) *http.Response {
	resp, err := http.Post("http://localhost:3500/currency", "application/json", bytes.NewReader([]byte(body)))
	Expect(err).ShouldNot(HaveOccurred())
	return resp
}

func convertCurrencies(query string) *http.Response {
	resp, err := http.Get(fmt.Sprintf("http://localhost:3500/currency%s", query))
	Expect(err).ShouldNot(HaveOccurred())
	return resp
}

func deleteCurrency(currency string) *http.Response {
	req, err := http.NewRequest(http.MethodDelete, "http://localhost:3500/currency/"+currency, nil)
	Expect(err).ShouldNot(HaveOccurred())
	httpClient := http.Client{}
	resp, err := httpClient.Do(req)
	Expect(err).ShouldNot(HaveOccurred())
	return resp
}

func getResponseBody(reader io.ReadCloser) string {
	body, err := ioutil.ReadAll(reader)
	Expect(err).ShouldNot(HaveOccurred())
	return string(body)
}

func deleteCurrencyAnyway(currency string) {
	deleteCurrency(currency)
}

func addCurrencySuccessfully(currency string) {
	resp, err := http.Post("http://localhost:3500/currency", "application/json", bytes.NewReader([]byte(fmt.Sprintf(`{"code":"%s"}`, currency))))
	Expect(err).ShouldNot(HaveOccurred())
	Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusCreated))
}
