package handlers

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/iiurydias/challenge-bravo/api/application/controller"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

var url string

func TestAddCurrency(t *testing.T) {
	RegisterTestingT(t)
	mockController := &MockController{}
	handlers := New(mockController)
	r := gin.Default()
	r.POST("/currency", handlers.AddCurrency())
	r.DELETE("/currency/:id", handlers.RemoveCurrency())
	r.GET("/currency", handlers.ConvertCurrency())
	ts := httptest.NewServer(r)
	defer ts.Close()
	url = ts.URL
	t.Run("it tests add a valid currency", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return nil
		}
		resp := addCurrency(`{"code":"BRL"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusCreated))
		Expect(body).Should(BeEquivalentTo(`{"status":"success","data":{"code":"BRL"}}`))
	})
	t.Run("it tests add a valid currency with invalid code type", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return nil
		}
		resp := addCurrency(`{"code":1}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code has a invalid type"}}`))
	})
	t.Run("it tests add a valid currency with invalid json body", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return nil
		}
		resp := addCurrency(`{"code":"brl"`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"body":"invalid json body"}}`))
	})
	t.Run("it tests add a valid currency missing code on request", func(t *testing.T) {
		resp := addCurrency(`{"cod":"brl"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code is a required field"}}`))
	})
	t.Run("it tests add a valid currency with error", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return errors.New("failed")
		}
		resp := addCurrency(`{"code":"brl"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusInternalServerError))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"error","message":"data has been lost on server"}`))
	})
	t.Run("it tests add a already existent currency", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return status.Error(codes.AlreadyExists, "")
		}
		resp := addCurrency(`{"code":"brl"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code already exist"}}`))
	})
	t.Run("it tests add a invalid currency", func(t *testing.T) {
		mockController.addCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return status.Error(codes.InvalidArgument, "")
		}
		resp := addCurrency(`{"code":"brl"}`)
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code is invalid"}}`))
	})
	t.Run("it tests remove a currency", func(t *testing.T) {
		mockController.removeCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return nil
		}
		resp := deleteCurrency("brl")
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNoContent))
	})
	t.Run("it tests remove a currency with failure", func(t *testing.T) {
		mockController.removeCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return errors.New("failed")
		}
		resp := deleteCurrency("brl")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusInternalServerError))
		Expect(body).Should(BeEquivalentTo(`{"status":"error","message":"data has been lost on server"}`))
	})
	t.Run("it tests remove a nonexistent currency", func(t *testing.T) {
		mockController.removeCurrencyFunc = func(code string) error {
			Expect(code).Should(BeEquivalentTo("BRL"))
			return status.Error(codes.NotFound, "")
		}
		resp := deleteCurrency("brl")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"code":"code not found"}}`))
	})
	t.Run("it tests convert two valid currency", func(t *testing.T) {
		mockController.convertCurrencyFunc = func(from, to string, amount float64) (float64, error) {
			Expect(from).Should(BeEquivalentTo("BRL"))
			Expect(to).Should(BeEquivalentTo("USD"))
			Expect(amount).Should(BeEquivalentTo(2))
			return 25, nil
		}
		resp := convertCurrencies("?from=BRL&to=USD&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
		Expect(body).Should(BeEquivalentTo(`{"status":"success","data":{"from":"BRL","to":"USD","amount":"2","result":25}}`))
	})
	t.Run("it tests convert two valid currency missing from currency", func(t *testing.T) {
		resp := convertCurrencies("?&to=USD&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from is a required field"}}`))
	})
	t.Run("it tests convert two valid currency missing to currency", func(t *testing.T) {
		resp := convertCurrencies("?&from=BRL&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to is a required field"}}`))
	})
	t.Run("it tests convert two valid currency missing amount", func(t *testing.T) {
		resp := convertCurrencies("?&from=BRL&to=USD")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"amount":"amount is a required field"}}`))
	})
	t.Run("it tests convert currencies with not found from currency", func(t *testing.T) {
		mockController.convertCurrencyFunc = func(from, to string, amount float64) (float64, error) {
			Expect(from).Should(BeEquivalentTo("BRL"))
			Expect(to).Should(BeEquivalentTo("USD"))
			Expect(amount).Should(BeEquivalentTo(2))
			return 25, controller.ErrFromCurrencyNotFound
		}
		resp := convertCurrencies("?from=BRL&to=USD&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from currency not found"}}`))
	})
	t.Run("it tests convert currencies with not found to currency", func(t *testing.T) {
		mockController.convertCurrencyFunc = func(from, to string, amount float64) (float64, error) {
			Expect(from).Should(BeEquivalentTo("BRL"))
			Expect(to).Should(BeEquivalentTo("USD"))
			Expect(amount).Should(BeEquivalentTo(2))
			return 25, controller.ErrToCurrencyNotFound
		}
		resp := convertCurrencies("?from=BRL&to=USD&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(body).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to currency not found"}}`))
	})
	t.Run("it tests convert currencies with failure", func(t *testing.T) {
		mockController.convertCurrencyFunc = func(from, to string, amount float64) (float64, error) {
			Expect(from).Should(BeEquivalentTo("BRL"))
			Expect(to).Should(BeEquivalentTo("USD"))
			Expect(amount).Should(BeEquivalentTo(2))
			return 25, errors.New("failed")
		}
		resp := convertCurrencies("?from=BRL&to=USD&amount=2")
		body := getResponseBody(resp.Body)
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusInternalServerError))
		Expect(body).Should(BeEquivalentTo(`{"status":"error","message":"data has been lost on server"}`))
	})
}

type MockController struct {
	addCurrencyFunc     func(code string) error
	removeCurrencyFunc  func(code string) error
	convertCurrencyFunc func(from, to string, amount float64) (float64, error)
}

func (m *MockController) AddCurrency(code string) error {
	return m.addCurrencyFunc(code)
}
func (m *MockController) RemoveCurrency(code string) error {
	return m.removeCurrencyFunc(code)
}
func (m *MockController) ConvertCurrency(from, to string, amount float64) (float64, error) {
	return m.convertCurrencyFunc(from, to, amount)
}

func addCurrency(body string) *http.Response {
	resp, err := http.Post(fmt.Sprintf("%s/currency", url), "application/json", bytes.NewReader([]byte(body)))
	Expect(err).ShouldNot(HaveOccurred())
	return resp
}

func convertCurrencies(query string) *http.Response {
	resp, err := http.Get(fmt.Sprintf("%s/currency%s", url, query))
	Expect(err).ShouldNot(HaveOccurred())
	return resp
}

func deleteCurrency(currency string) *http.Response {
	req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("%s/currency/%s", url, currency), nil)
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
	resp, err := http.Post(fmt.Sprintf("%s/currency", url), "application/json", bytes.NewReader([]byte(fmt.Sprintf(`{"code":"%s"}`, currency))))
	Expect(err).ShouldNot(HaveOccurred())
	Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusCreated))
}
