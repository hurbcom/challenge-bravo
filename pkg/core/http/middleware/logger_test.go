package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"challenge-bravo/pkg/core/log"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestLogger(t *testing.T) {
	type args struct {
		logger  *log.MockLogger
		handler http.HandlerFunc
		req     *http.Request
		writer  *httptest.ResponseRecorder
	}
	type want struct {
		code               int
		loggerExpectations func(logger *log.MockLogger, params ...interface{})
		params             []interface{}
	}
	tests := []struct {
		name string
		args args
		want want
	}{
		{
			name: "success",
			args: args{
				logger:  log.NewMockLogger(gomock.NewController(t)),
				req:     httptest.NewRequest(http.MethodGet, "/", nil),
				writer:  httptest.NewRecorder(),
				handler: func(w http.ResponseWriter, r *http.Request) {},
			},
			want: want{
				code: http.StatusOK,
				params: []interface{}{
					log.Any("method", http.MethodGet),
					log.Any("path", "/"),
					gomock.Any(),
					log.Any("status", http.StatusOK),
					log.Any("size_bytes", 0),
					gomock.Any(),
					gomock.Any(),
				},
				loggerExpectations: func(logger *log.MockLogger, params ...interface{}) {
					logger.EXPECT().Info(
						gomock.Any(),
						"http",
						params...,
					).Times(1)
				},
			},
		},
		{
			name: "success with size > 0",
			args: args{
				logger:  log.NewMockLogger(gomock.NewController(t)),
				req:     httptest.NewRequest(http.MethodGet, "/", nil),
				writer:  httptest.NewRecorder(),
				handler: func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "ola") },
			},
			want: want{
				code: http.StatusOK,
				params: []interface{}{
					log.Any("method", http.MethodGet),
					log.Any("path", "/"),
					gomock.Any(),
					log.Any("status", http.StatusOK),
					log.Any("size_bytes", 3),
					gomock.Any(),
					gomock.Any(),
				},
				loggerExpectations: func(logger *log.MockLogger, params ...interface{}) {
					logger.EXPECT().Info(
						gomock.Any(),
						"http",
						params...,
					)
				},
			},
		},
		{
			name: "success with another status code",
			args: args{
				logger:  log.NewMockLogger(gomock.NewController(t)),
				req:     httptest.NewRequest(http.MethodGet, "/", nil),
				writer:  httptest.NewRecorder(),
				handler: func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusAccepted) },
			},
			want: want{
				code: http.StatusAccepted,
				params: []interface{}{
					log.Any("method", http.MethodGet),
					log.Any("path", "/"),
					gomock.Any(),
					log.Any("status", http.StatusAccepted),
					log.Any("size_bytes", 0),
					gomock.Any(),
					gomock.Any(),
				},
				loggerExpectations: func(logger *log.MockLogger, params ...interface{}) {
					logger.EXPECT().Info(
						gomock.Any(),
						"http",
						params...,
					).Times(1)
				},
			},
		},
		{
			name: "success with another status code and size > 0",
			args: args{
				logger: log.NewMockLogger(gomock.NewController(t)),
				req:    httptest.NewRequest(http.MethodGet, "/", nil),
				writer: httptest.NewRecorder(),
				handler: func(w http.ResponseWriter, r *http.Request) {
					w.WriteHeader(http.StatusAccepted)
					fmt.Fprint(w, "ola")
				},
			},
			want: want{
				code: http.StatusAccepted,
				params: []interface{}{
					log.Any("method", http.MethodGet),
					log.Any("path", "/"),
					gomock.Any(),
					log.Any("status", http.StatusAccepted),
					log.Any("size_bytes", 3),
					gomock.Any(),
					gomock.Any(),
				},
				loggerExpectations: func(logger *log.MockLogger, params ...interface{}) {
					logger.EXPECT().Info(
						gomock.Any(),
						"http",
						params...,
					).Times(1)
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.want.loggerExpectations(tt.args.logger, tt.want.params...)
			Logger(tt.args.logger)(tt.args.handler).ServeHTTP(tt.args.writer, tt.args.req)
			response := tt.args.writer.Result()
			assert.Equal(t, tt.want.code, response.StatusCode)
			assert.NoError(t, response.Body.Close())
		})
	}
}
