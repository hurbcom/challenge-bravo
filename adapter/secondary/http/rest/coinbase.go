package rest

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

type (
	CoinbaseItemDataResponseBody struct {
		Amount   string `json:"amount"`
		Currency string `json:"currency"`
	}

	CoinbaseItemResponseBody struct {
		Data CoinbaseItemDataResponseBody `json:"data"`
	}

	CoinbaseResponseBody map[string]CoinbaseItemResponseBody

	CoinbaseResult struct {
		Name   string
		Amount float64
	}
)

func (s *Service) getCryptoRate(base, currency string) (*CoinbaseItemResponseBody, error) {
	endpoint := fmt.Sprintf("%s/v2/prices/%s-%s/buy", s.coinbaseapiURL, currency, base)
	nonce := strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	message := nonce + http.MethodGet + endpoint

	h := hmac.New(sha256.New, []byte(apiKeySecret))
	h.Write([]byte(message))

	signature := hex.EncodeToString(h.Sum(nil))

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("CB-ACCESS-KEY", apiKey)
	req.Header.Set("CB-ACCESS-SIGN", signature)
	req.Header.Set("CB-ACCESS-TIMESTAMP", nonce)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	var result CoinbaseItemResponseBody
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (s *Service) ListCryptoRates(base string) ([]CoinbaseResult, error) {
	ethereum, err := s.getCryptoRate(base, coin.ETH)
	if err != nil {
		return nil, err
	}

	bitcoin, err := s.getCryptoRate(base, coin.BTC)
	if err != nil {
		return nil, err
	}

	result := make([]CoinbaseResult, 0)

	amount, err := strconv.ParseFloat(ethereum.Data.Amount, 64)
	if err != nil {
		return nil, err
	}
	result = append(result, CoinbaseResult{
		Name:   coin.ETH,
		Amount: amount,
	})

	amount, err = strconv.ParseFloat(bitcoin.Data.Amount, 64)
	if err != nil {
		return nil, err
	}
	result = append(result, CoinbaseResult{
		Name:   coin.BTC,
		Amount: amount,
	})

	return result, nil
}
