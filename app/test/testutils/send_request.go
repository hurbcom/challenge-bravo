package testutils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/service"
)

func SendRequest(t *testing.T, method, endpoint string, data any) *http.Response {
	url := fmt.Sprintf("%s/v1/%s", server.URL, endpoint)

	jsonData, err := json.Marshal(data)
	if err != nil {
		t.Fatalf("could not marshal response body: %v", err)
	}

	body := bytes.NewReader(jsonData)

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		t.Fatalf("could not open a new request to path: %s", endpoint)
	}

	req.Header.Set("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		t.Fatalf("request failed %v", err)
	}

	return res
}

func SendRequestWithToken(t *testing.T, method, endpoint string, user entity.User, data any) *http.Response {
	url := fmt.Sprintf("%s/v1/%s", server.URL, endpoint)

	jsonData, err := json.Marshal(data)
	if err != nil {
		t.Fatalf("could not marshal response body: %v", err)
	}

	body := bytes.NewReader(jsonData)

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		t.Fatalf("could not open a new request to path: %s", endpoint)
	}

	req.Header.Set("Content-Type", "application/json")

	token, err := service.NewJwtService().CreateToken(user)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(req)
	if err != nil {
		t.Fatalf("request failed %v", err)
	}

	return res
}
