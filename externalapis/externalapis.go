// Package externalapis provides helper utility funcs to iteract with external APIs.
package externalapis

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// MakeRequest is a generic helper utility func to make a resquest to a HTTP server.
// It is usually used to make API calls, but it is general purpose and can be used to make
// any kind of HTTP request.
func MakeRequest[T any](ctx context.Context, method, finalURL string, body []byte, headers map[string]string, httpClient *http.Client) (data *T, rawBody []byte, httpCode int, err error) {
	req, err := http.NewRequestWithContext(ctx, method, finalURL, bytes.NewBuffer(body))
	if err != nil {
		return nil, nil, 0, err
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, nil, 0, err
	}
	defer resp.Body.Close()

	transcodedBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, transcodedBody, resp.StatusCode, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, transcodedBody, resp.StatusCode, errors.New("response code was not 200")
	}

	var decoded T
	err = json.Unmarshal(transcodedBody, &decoded)
	if err != nil {
		return nil, transcodedBody, resp.StatusCode, fmt.Errorf("failed to unmarshal body. err: %s", err)
	}

	return &decoded, transcodedBody, resp.StatusCode, err
}
