package externalapis

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
)

func TestMakeRequest(t *testing.T) {
	assert := assert.New(t)

	type TestBody struct {
		Value string `json:"value"`
	}

	r := chi.NewRouter()
	r.Get("/test", func(w http.ResponseWriter, r *http.Request) {
		switch r.Header.Get("TestKind") {
		case "reader-fail":
			w.Header().Add("Content-Length", "1")
			_, _ = w.Write([]byte("larger than one"))
		case "not-ok":
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("not ok"))
		case "wrong-body":
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("wrong body"))
		case "valid":
			w.WriteHeader(http.StatusOK)
			byts, _ := json.Marshal(TestBody{Value: "valid"})
			_, _ = w.Write(byts)
		}
	})
	s := httptest.NewServer(r)
	defer s.Close()

	for index, tc := range []struct {
		ctx       context.Context
		method    string
		finalURL  string
		body      []byte
		headers   map[string]string
		client    *http.Client
		wantData  *TestBody
		wantBody  []byte
		wantCode  int
		shouldErr bool
	}{
		{nil, "", "", nil, nil, nil, nil, nil, 0, true},
		{context.Background(), "GET", "invalid url .. ", nil, map[string]string{"Content-Type": "application/json"}, nil, nil, nil, 0, true},
		{context.Background(), "GET", s.URL + "/test", nil, map[string]string{"TestKind": "reader-fail"}, nil, nil, []byte{}, 200, true},
		{context.Background(), "GET", s.URL + "/test", nil, map[string]string{"TestKind": "not-ok"}, nil, nil, []byte("not ok"), 400, true},
		{context.Background(), "GET", s.URL + "/test", nil, map[string]string{"TestKind": "wrong-body"}, nil, nil, []byte("wrong body"), 200, true},
		{context.Background(), "GET", s.URL + "/test", nil, map[string]string{"TestKind": "valid"}, nil, &TestBody{Value: "valid"}, []byte(`{"value":"valid"}`), 200, false},
	} {
		data, body, code, err := MakeRequest[TestBody](tc.ctx, tc.method, tc.finalURL, tc.body, tc.headers, tc.client)
		if tc.shouldErr {
			assert.Error(err, fmt.Sprintf("error at index %d", index))
		} else {
			assert.NoError(err, fmt.Sprintf("error at index %d", index))
		}

		assert.Equal(tc.wantCode, code, fmt.Sprintf("error at index %d", index))
		assert.Equal(tc.wantBody, body)
		assert.EqualValues(tc.wantData, data, fmt.Sprintf("error at index %d", index))
	}
}
