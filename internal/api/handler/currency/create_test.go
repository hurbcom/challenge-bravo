package currency

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

var r *gin.Engine

func init() {
	err := godotenv.Load("../../../../test/test.env")
	if err != nil {
		panic(err)
	}
	r = startHandler()
}
func startHandler() *gin.Engine {
	var ctx = context.Background()
	var repo = repository.NewEngine(ctx)
	var handler = NewHandler(repo)
	var r = gin.Default()
	r.POST("/api/v1/currency", handler.Create)
	return r
}

func TestHandler_Create(t *testing.T) {
	type args struct {
		name     string
		status   int
		body     map[string]interface{}
		respBody string
		wantErr  bool
	}
	tests := []args{
		{
			name:   "create currency",
			status: http.StatusCreated,
			body: map[string]interface{}{
				"code": "USD", "name": "Dollar", "price": 1,
			},
			respBody: fmt.Sprintf(`{"code":"USD","name":"Dollar","price":"1", created_at: %s}`, time.Now()),
			wantErr:  false,
		},
		{
			name:   "create currency with invalid json",
			status: http.StatusBadRequest,
			body: map[string]interface{}{
				"code": "USD", "name": "Dollar",
			},
			respBody: `{"data":{"price":"price is required"}}`,
			wantErr:  false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytesCurr, err := json.Marshal(tt.body)
			if err != nil {
				t.Error(err)
				t.Fail()
			}
			req, err := http.NewRequest("POST", "/api/v1/currency", bytes.NewBuffer(bytesCurr))
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if !assert.Equal(t, tt.status, w.Code) {
				t.Fail()
			}
		})
	}
}
