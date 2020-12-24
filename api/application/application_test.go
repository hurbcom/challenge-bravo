package application

import (
	"bytes"
	"context"
	"errors"
	"github.com/go-redis/redis/v7"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	"github.com/iiurydias/challenge-bravo/api/application/client/currency"
	"github.com/iiurydias/challenge-bravo/api/cache"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"testing"
	"time"
)

func TestApplication(t *testing.T) {
	RegisterTestingT(t)
	cfg := getMockConfig()
	api, err := New(cfg)
	Expect(err).ShouldNot(HaveOccurred())
	api.Run()
	defer api.Shutdown()
	l, err := net.Listen("tcp", ":4501")
	Expect(err).ShouldNot(HaveOccurred())
	currencyServer := &MockServer{}
	grpcServer := grpc.NewServer()
	currency.RegisterCurrencyServiceServer(grpcServer, currencyServer)
	go func() {
		grpcServer.Serve(l)
	}()
	defer grpcServer.GracefulStop()
	redisClient := MockRedisClient(cfg.Cache)
	time.Sleep(1 * time.Second)
	t.Run("it tests add a valid currency", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return &currency.Response{Success: true}, nil
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":"brl"}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusCreated,
			"body":   `{"status":"success","data":{"code":"BRL"}}`,
		}))
	})
	t.Run("it tests add a currency with invalid code type", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return &currency.Response{Success: true}, nil
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":1}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusBadRequest,
			"body":   `{"status":"fail","data":{"code":"code has a invalid type"}}`,
		}))
	})
	t.Run("it tests add a currency with invalid json body", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return &currency.Response{Success: true}, nil
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":"brl"`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusBadRequest,
			"body":   `{"status":"fail","data":{"body":"invalid json body"}}`,
		}))
	})
	t.Run("it tests add a already existent currency", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return nil, status.Error(codes.AlreadyExists, "")
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":"brl"}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusBadRequest,
			"body":   `{"status":"fail","data":{"code":"code already exist"}}`,
		}))
	})
	t.Run("it tests add a currency with failure", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return nil, errors.New("failed")
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":"brl"}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusInternalServerError,
			"body":   `{"status":"error","message":"data has been lost on server"}`,
		}))
	})
	t.Run("it tests add a invalid currency", func(t *testing.T) {
		currencyServer.addCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return nil, status.Error(codes.InvalidArgument, "")
		}
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"code":"brl"}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusBadRequest,
			"body":   `{"status":"fail","data":{"code":"code is invalid"}}`,
		}))
	})
	t.Run("it tests add a valid currency missing code", func(t *testing.T) {
		Eventually(func() map[string]interface{} {
			resp, err := http.Post("http://localhost:3001/currency", "application/json", bytes.NewReader([]byte(`{"cod":"brl"}`)))
			Expect(err).ShouldNot(HaveOccurred())
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusBadRequest,
			"body":   `{"status":"fail","data":{"code":"code is a required field"}}`,
		}))
	})
	t.Run("it tests remove a currency", func(t *testing.T) {
		currencyServer.removeCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return &currency.Response{Success: true}, nil
		}
		Eventually(func() map[string]interface{} {
			req, err := http.NewRequest(http.MethodDelete, "http://localhost:3001/currency/brl", nil)
			Expect(err).ShouldNot(HaveOccurred())
			httpClient := http.Client{}
			resp, err := httpClient.Do(req)
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusNoContent,
			"body":   "",
		}))
	})
	t.Run("it tests remove a not found currency", func(t *testing.T) {
		currencyServer.removeCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return nil, status.Error(codes.NotFound, "")
		}
		Eventually(func() map[string]interface{} {
			req, err := http.NewRequest(http.MethodDelete, "http://localhost:3001/currency/brl", nil)
			Expect(err).ShouldNot(HaveOccurred())
			httpClient := http.Client{}
			resp, err := httpClient.Do(req)
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusNotFound,
			"body":   `{"status":"fail","data":{"code":"code not found"}}`,
		}))
	})
	t.Run("it tests remove a currency with failure", func(t *testing.T) {
		currencyServer.removeCurrencyFunc = func(ctx context.Context, req *currency.Request) (*currency.Response, error) {
			Expect(req.Code).Should(BeEquivalentTo("BRL"))
			return nil, errors.New("failed")
		}
		Eventually(func() map[string]interface{} {
			req, err := http.NewRequest(http.MethodDelete, "http://localhost:3001/currency/brl", nil)
			Expect(err).ShouldNot(HaveOccurred())
			httpClient := http.Client{}
			resp, err := httpClient.Do(req)
			Expect(err).ShouldNot(HaveOccurred())
			body, err := ioutil.ReadAll(resp.Body)
			Expect(err).ShouldNot(HaveOccurred())
			return map[string]interface{}{"status": resp.StatusCode, "body": string(body)}
		}, 2*time.Second, 600*time.Millisecond).Should(BeEquivalentTo(map[string]interface{}{
			"status": http.StatusInternalServerError,
			"body":   `{"status":"error","message":"data has been lost on server"}`,
		}))
	})
	t.Run("it tests convert currencies", func(t *testing.T) {
		flushCache(redisClient)
		err := redisClient.Set("BRL", 6, 0).Err()
		Expect(err).ShouldNot(HaveOccurred())
		err = redisClient.Set("USD", 1, 0).Err()
		Expect(err).ShouldNot(HaveOccurred())
		resp, err := http.Get("http://localhost:3001/currency?from=usd&to=brl&amount=1")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusOK))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"success","data":{"from":"USD","to":"BRL","amount":"1","result":6}}`))
	})
	t.Run("it tests convert currencies with nonexistent to currency", func(t *testing.T) {
		flushCache(redisClient)
		err = redisClient.Set("USD", 1, 0).Err()
		Expect(err).ShouldNot(HaveOccurred())
		resp, err := http.Get("http://localhost:3001/currency?from=usd&to=brl&amount=1")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to currency not found"}}`))
	})
	t.Run("it tests convert currencies with nonexistent from currency", func(t *testing.T) {
		flushCache(redisClient)
		err := redisClient.Set("BRL", 6, 0).Err()
		Expect(err).ShouldNot(HaveOccurred())
		resp, err := http.Get("http://localhost:3001/currency?from=usd&to=brl&amount=1")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusNotFound))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from currency not found"}}`))
	})
	t.Run("it tests convert currencies missing from currency", func(t *testing.T) {
		flushCache(redisClient)
		resp, err := http.Get("http://localhost:3001/currency?to=brl&amount=1")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"from":"from is a required field"}}`))
	})
	t.Run("it tests convert currencies missing to currency", func(t *testing.T) {
		flushCache(redisClient)
		resp, err := http.Get("http://localhost:3001/currency?from=usd&amount=1")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"to":"to is a required field"}}`))
	})
	t.Run("it tests convert currencies missing amount", func(t *testing.T) {
		flushCache(redisClient)
		resp, err := http.Get("http://localhost:3001/currency?from=usd&to=brl")
		Expect(err).ShouldNot(HaveOccurred())
		body, err := ioutil.ReadAll(resp.Body)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.StatusCode).Should(BeEquivalentTo(http.StatusBadRequest))
		Expect(string(body)).Should(BeEquivalentTo(`{"status":"fail","data":{"amount":"amount is a required field"}}`))
	})
}

func getMockConfig() *Config {
	return &Config{
		Cache: cache.Config{
			Host:     "localhost",
			Password: "dummyPass",
			Port:     6379,
			Database: 0,
		},
		LogLevel: 6,
		GrpcServer: client.Config{
			Host: "localhost",
			Port: 4501,
		},
		ServerPort: 3001,
	}
}

func MockRedisClient(config cache.Config) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Host + ":" + strconv.Itoa(config.Port),
		Password: config.Password,
		DB:       config.Database,
	})
}

func flushCache(client *redis.Client) {
	err := client.FlushAll().Err()
	Expect(err).ShouldNot(HaveOccurred())
}

type MockServer struct {
	addCurrencyFunc    func(ctx context.Context, req *currency.Request) (*currency.Response, error)
	removeCurrencyFunc func(ctx context.Context, req *currency.Request) (*currency.Response, error)
}

func (m *MockServer) AddCurrency(ctx context.Context, req *currency.Request) (*currency.Response, error) {
	return m.addCurrencyFunc(ctx, req)
}

func (m *MockServer) RemoveCurrency(ctx context.Context, req *currency.Request) (*currency.Response, error) {
	return m.removeCurrencyFunc(ctx, req)
}
