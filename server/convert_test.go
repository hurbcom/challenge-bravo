package server

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"challenge-bravo/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/steinfletcher/apitest"
	"github.com/stretchr/testify/assert"
	"io"
	"net/http"
	"os"
	"testing"
)

const convertEndPoint = "/api/v1/convert"

var app *fiber.App

type Test struct {
	description string
	method      string
	route       string
	queryParams map[string]string
	payload     interface{}
	statusCode  int
	response    interface{}
	asserts     func(t assert.TestingT, response interface{})
}

func TestConvertRoute(t *testing.T) {

	tests := []Test{{
		description: "Test convert route: USD->BRL",
		method:      http.MethodGet,
		route:       convertEndPoint,
		queryParams: map[string]string{"amount": "10", "from": "USD", "to": "BRL"},
		statusCode:  http.StatusOK,
		response:    &ConvertResponse{},
		asserts: func(t assert.TestingT, response interface{}) {
			resp := response.(*ConvertResponse)
			assert.Greaterf(t, resp.Quote, 50.0, "10 x USD should be greater than", 50.0, "BRL = ", resp.Quote)
			assert.Lessf(t, resp.Quote, 60.0, "10 x USD should be greater than", 60.0, "BRL = ", resp.Quote)
		},
	}, {
		description: "Test convert route: EUR->BRL",
		method:      http.MethodGet,
		route:       convertEndPoint,
		queryParams: map[string]string{"amount": "10", "from": "EUR", "to": "BRL"},
		statusCode:  http.StatusOK,
		response:    &ConvertResponse{},
		asserts: func(t assert.TestingT, response interface{}) {
			resp := response.(*ConvertResponse)
			assert.Greaterf(t, resp.Quote, 60.0, "10 x USD should be greater than", 60.0, "BRL = ", resp.Quote)
			assert.Lessf(t, resp.Quote, 70.0, "10 x USD should be greater than", 70.0, "BRL = ", resp.Quote)
		},
	}, {
		description: "Test convert route: BTC->BRL",
		method:      http.MethodGet,
		route:       convertEndPoint,
		queryParams: map[string]string{"amount": "10", "from": "BTC", "to": "BRL"},
		statusCode:  http.StatusOK,
		response:    &ConvertResponse{},
		asserts: func(t assert.TestingT, response interface{}) {
			resp := response.(*ConvertResponse)
			assert.Greaterf(t, resp.Quote, 2500000.0, "10 x BTC should be greater than 2.500.000 BRL = ", resp.Quote)
			assert.Lessf(t, resp.Quote, 3000000.0, "10 x BTC should be greater than 3.000.000 BRL = ", resp.Quote)
		},
	}, {
		description: "Test convert route: EUR->ETH",
		method:      http.MethodGet,
		route:       convertEndPoint,
		queryParams: map[string]string{"amount": "10", "from": "EUR", "to": "ETH"},
		statusCode:  http.StatusOK,
		response:    &ConvertResponse{},
		asserts: func(t assert.TestingT, response interface{}) {
			resp := response.(*ConvertResponse)
			assert.Greaterf(t, resp.Quote, 0.001, "10 x EUR should be greater than", 0.001, "ETH = ", resp.Quote)
			assert.Lessf(t, resp.Quote, 0.003, "10 x EUR should be less than than", 0.003, "ETH = ", resp.Quote)
		},
	}, {
		description: "Test convert route: BTC->ETH",
		method:      http.MethodGet,
		route:       convertEndPoint,
		queryParams: map[string]string{"amount": "10", "from": "BTC", "to": "ETH"},
		statusCode:  http.StatusOK,
		response:    &ConvertResponse{},
		asserts: func(t assert.TestingT, response interface{}) {
			resp := response.(*ConvertResponse)
			assert.Greater(t, resp.Quote, 100.0, "10 x BTC should be greater than", 100, "ETH = ", resp.Quote)
			assert.Less(t, resp.Quote, 150.0, "10 x BTC should be less than than", 150, "ETH = ", resp.Quote)
		},
	}}
	executeApiTest(tests, t)
}

func executeApiTest(tests []Test, t *testing.T) {
	for _, test := range tests {
		t.Run(test.description, func(t *testing.T) {
			apitest.New().
				HandlerFunc(fiberToHandlerFunc(app)).
				Method(test.method).
				URL(test.route).
				QueryParams(test.queryParams).
				JSON(test.payload).
				Expect(t).
				Status(test.statusCode).
				End().
				JSON(&test.response)
			test.asserts(t, test.response)
		})
	}
}

func fiberToHandlerFunc(app *fiber.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		resp, err := app.Test(r)
		if err != nil {
			panic(err)
		}

		// copy headers
		for k, vv := range resp.Header {
			for _, v := range vv {
				w.Header().Add(k, v)
			}
		}
		w.WriteHeader(resp.StatusCode)

		// copy body
		if _, err = io.Copy(w, resp.Body); err != nil {
			panic(err)
		}
	}
}

func init() {

	var servicesConfig services.Config
	var dbConnectionString, cacheConnectionString string

	if db, ok := os.LookupEnv(model.EnvDBKey); ok {
		dbConnectionString = db
	}
	if cache, ok := os.LookupEnv(model.EnvCacheKey); ok {
		cacheConnectionString = cache
	}

	if fixer, ok := os.LookupEnv(model.EnvFixerKey); ok {
		servicesConfig.FixerKey = fixer
	}

	if currLayerKey, ok := os.LookupEnv(model.EnvCurrencyLayerKey); ok {
		servicesConfig.CurrencyLayerKey = currLayerKey
	}

	if coinLayerKey, ok := os.LookupEnv(model.EnvCoinLayerKey); ok {
		servicesConfig.CoinLayerKey = coinLayerKey
	}

	// Initalize data layer
	if err := dao.Init(dbConnectionString, cacheConnectionString); err != nil {
		os.Exit(1)
	}

	// Initialize services
	if err := services.Init(servicesConfig); err != nil {
		dao.Terminate()
		os.Exit(1)
	}

	// Create the web server
	app = fiber.New()

	// Middleware used to recover from a panic event
	app.Use(recover.New())

	// Create server routes
	createRoutes(app)

}
