package coinmarket

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"
)

var ErrRequest = errors.New("error on processing request")

//CoinMarketCaller is the generic request caller from CoinMarketCap API
type CoinMarketCaller struct {
	Endpoint  string
	AccessKey string
}

//CallAPI makes a single request to the CoinMarketCap API
func (cc *CoinMarketCaller) CallAPI(method, path string, formValues map[string]string) ([]byte, error) {
	client := &http.Client{
		Timeout: time.Second * 3,
	}

	query := url.Values{}
	for key, value := range formValues {
		query.Set(key, value)
	}

	url := fmt.Sprintf("%s/%s", cc.Endpoint, path)
	request, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, ErrRequest
	}
	request.URL.RawQuery = query.Encode()

	request.Header.Set("X-CMC_PRO_API_KEY", cc.AccessKey)

	response, err := client.Do(request)

	if err != nil {
		return nil, ErrRequest
	}
	if response.StatusCode >= 500 {
		return nil, ErrRequest
	}
	defer response.Body.Close()

	bodyBytes, err := ioutil.ReadAll(response.Body)
	return bodyBytes, err
}
