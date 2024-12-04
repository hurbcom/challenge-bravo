package external

import (
	"bytes"
	"errors"
	"io"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const (
	METHOD_GET       = "GET"
	EXAMPLE_URL      = "https://example.com"
	RESPONSE_SUCCESS = `{"response":"success"}`
	RESPONSE_ERROR   = `{"response":"error"}`
)

// MockHTTPClient is a mock implementation of the HTTPClient interface
type MockHTTPClient struct {
	mock.Mock
}

func (m *MockHTTPClient) Do(req *http.Request) (*http.Response, error) {
	args := m.Called(req)
	return args.Get(0).(*http.Response), args.Error(1)
}

// Custom matcher for http.Request to ignore body differences
func requestMatcher(expected *http.Request) func(*http.Request) bool {
	return func(actual *http.Request) bool {
		return expected.Method == actual.Method &&
			expected.URL.String() == actual.URL.String() &&
			expected.Header.Get("Content-Type") == actual.Header.Get("Content-Type")
	}
}

func TestDoRequest_Success(t *testing.T) {
	mockClient := new(MockHTTPClient)
	client := NewClient(mockClient)

	body := []byte(`{}`)
	req, _ := http.NewRequest(METHOD_GET, EXAMPLE_URL, bytes.NewBuffer(body))
	resp := &http.Response{
		StatusCode: http.StatusOK,
		Body:       io.NopCloser(io.Reader(bytes.NewBufferString(RESPONSE_SUCCESS))),
	}

	mockClient.On("Do", mock.MatchedBy(requestMatcher(req))).Return(resp, nil)

	response, err := client.DoRequest(METHOD_GET, EXAMPLE_URL, body)

	assert.NoError(t, err)
	assert.Equal(t, RESPONSE_SUCCESS, string(response))
	mockClient.AssertExpectations(t)
}

func TestDoRequest_Retry(t *testing.T) {
	mockClient := new(MockHTTPClient)
	client := NewClient(mockClient)

	body := []byte(`{}`)
	req, _ := http.NewRequest(METHOD_GET, EXAMPLE_URL, bytes.NewBuffer(body))
	resp := &http.Response{
		StatusCode: http.StatusInternalServerError,
		Body:       io.NopCloser(io.Reader(bytes.NewBufferString(RESPONSE_ERROR))),
	}

	mockClient.On("Do", mock.MatchedBy(requestMatcher(req))).Return(resp, errors.New("server error")).Times(3)

	start := time.Now()
	_, err := client.DoRequest(METHOD_GET, EXAMPLE_URL, body)
	duration := time.Since(start)

	assert.Error(t, err)
	assert.True(t, duration >= 3*time.Second, "Expected retries to take at least 3 seconds")
	mockClient.AssertExpectations(t)
}
