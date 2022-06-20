package conversion

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/currency"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

var r *gin.Engine

func init() {
	err := godotenv.Load("../../../../../test/test.env")
	if err != nil {
		panic(err)
	}
	r = startHandler()
	createToGetConversion()
}
func startHandler() *gin.Engine {
	var ctx = context.Background()
	var repo = repository.NewEngine(ctx)
	var handlerConversion = NewHandler(repo)
	var r = gin.Default()
	r.GET("/api/v1/currency/conversion", handlerConversion.Handle)
	var handler = currency.NewHandler(repo)
	r.POST("/api/v1/currency", handler.Create)
	return r
}

func createToGetConversion() {
	type args struct {
		name string
		body map[string]interface{}
	}
	bases := []args{
		{
			name: "create USD",
			body: map[string]interface{}{
				"code": "USD", "name": "Dollar", "price": 1,
			},
		},
		{
			name: "create BRL",
			body: map[string]interface{}{
				"code": "BRL", "name": "Real", "price": 2,
			},
		},
	}
	for _, b := range bases {
		bytesCurr, err := json.Marshal(b.body)
		if err != nil {
			panic(err)
		}
		req, err := http.NewRequest("POST", "/api/v1/currency", bytes.NewBuffer(bytesCurr))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
	}
}

func TestHandler_Handle(t *testing.T) {
	type args struct {
		name     string
		status   int
		params   map[string]string
		respBody string
	}
	tests := []args{
		{
			name:   "get conversion",
			status: http.StatusOK,
			params: map[string]string{
				"from": "USD", "to": "BRL",
			},
		},
		{
			name:   "get invalid conversion",
			status: http.StatusBadRequest,
			params: map[string]string{
				"from": "USD", "to": "FDLASFA",
			},
			respBody: `{"data":{"price":"price is required"}}`,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/api/v1/currency/conversion", nil)
			q := req.URL.Query()
			q.Add("amount", "100")
			for k, v := range tt.params {
				q.Add(k, v)
			}
			req.URL.RawQuery = q.Encode()
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if !assert.Equal(t, tt.status, w.Code) {
				t.Fail()
			}
		})
	}
}
