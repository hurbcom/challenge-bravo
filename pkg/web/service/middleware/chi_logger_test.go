package middleware

import (
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestChiLogger(t *testing.T) {
	assert := assert.New(t)

	core, logs := observer.New(zap.InfoLevel)
	logger := zap.New(core)

	router := chi.NewRouter()
	router.Use(ChiLogger(logger))
	router.Get("/test", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("test"))
	})

	ts := httptest.NewServer(router)
	defer ts.Close()

	client := ts.Client()

	resp, err := client.Get(ts.URL + "/test")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	chiRegex := regexp.MustCompile(`\[CHI\]`)
	assert.True(chiRegex.MatchString(logs.All()[0].Message))

	colorString := "\033\\[97;42m 200 \033\\[0m"
	colorRegex := regexp.MustCompile(colorString)
	assert.True(colorRegex.MatchString(logs.All()[0].Message))

	endpointRegex := regexp.MustCompile(`"/test"`)
	assert.True(endpointRegex.MatchString(logs.All()[0].Message))

	methodString := "\033\\[97;44m GET     \033\\[0m"
	methodRegex := regexp.MustCompile(methodString)
	assert.True(methodRegex.MatchString(logs.All()[0].Message))
}

func TestReadUserIP(t *testing.T) {
	assert := assert.New(t)

	// Test invalid IP
	req := &http.Request{
		RemoteAddr: "invalid ip addres",
	}

	assert.Empty(readUserIP(req))

	// Test valid IP
	req = &http.Request{
		RemoteAddr: "127.0.0.1:8080",
	}

	assert.Equal("127.0.0.1", readUserIP(req))

	// Test nil IP
	req = &http.Request{
		RemoteAddr: "127.0:1",
	}

	assert.Empty(readUserIP(req))
}

func TestFindMethodColor(t *testing.T) {
	assert := assert.New(t)

	expectedResults := map[string]string{
		http.MethodConnect: reset,
		http.MethodDelete:  red,
		http.MethodGet:     blue,
		http.MethodHead:    magenta,
		http.MethodOptions: white,
		http.MethodPatch:   green,
		http.MethodPost:    cyan,
		http.MethodPut:     yellow,
		http.MethodTrace:   reset,
	}

	for method, expected := range expectedResults {
		assert.Equal(expected, findMethodColor(method))
	}
}

func TestFindStatusCodeColor(t *testing.T) {
	assert := assert.New(t)

	for i := 0; i < 1001; i++ {
		var expected string
		switch {
		case i < http.StatusOK:
			expected = red
		case i >= http.StatusOK && i < http.StatusMultipleChoices:
			expected = green
		case i >= http.StatusMultipleChoices && i < http.StatusBadRequest:
			expected = white
		case i >= http.StatusBadRequest && i < http.StatusInternalServerError:
			expected = yellow
		default:
			expected = red
		}

		assert.Equal(expected, findStatusCodeColor(i))
	}
}
