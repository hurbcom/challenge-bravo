package external

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"time"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

// Client struct
type Client struct {
	httpClient HTTPClient
}

// NewClient creates a new Client
func NewClient(httpClient HTTPClient) *Client {
	return &Client{httpClient: httpClient}
}

// DoRequest makes an HTTP request with retries
func (c *Client) DoRequest(method, path string, body []byte) ([]byte, error) {
	var resp *http.Response

	retries := []time.Duration{1 * time.Second, 2 * time.Second, 5 * time.Second}

	for i, retry := range retries {
		req, err := http.NewRequest(method, path, bytes.NewBuffer(body))
		if err != nil {
			log.Println("error creating request: ", err)
			return nil, err
		}

		resp, err = c.httpClient.Do(req)
		if lastRetry(i, len(retries)) && err != nil {
			defer resp.Body.Close()
			log.Println("error making request: ", err)
			return nil, err
		}
		if err == nil && resp.StatusCode >= 200 && resp.StatusCode < 300 {
			log.Println("request successful! Retry count:", i+1)
			break
		}
		time.Sleep(retry)
	}

	defer resp.Body.Close()
	return io.ReadAll(io.Reader(resp.Body))
}

func lastRetry(i int, rCount int) bool {
	return rCount == i+1
}
