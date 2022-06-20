package test

import (
	"fmt"
	"io"
	"net/http"
	"sync"
	"testing"
	"time"
)

type args struct {
	payload       map[string]interface{}
	params        string
	endpoint      string
	method        string
	spectedStatus int
	spectedError  bool
}

func NewArgs() *args {
	return &args{
		payload:       nil,
		endpoint:      "http://localhost:8080/api/v1/currency/conversion?from=BTC&to=BRL&amount=20",
		spectedError:  false,
		spectedStatus: http.StatusOK,
	}
}
func TestStressTest(tt *testing.T) {
	var wg = new(sync.WaitGroup)
	for i := 0; i < 20000; i++ {
		wg.Add(1)
		go func(index int) {
			var ag = NewArgs()
			var client = http.Client{
				Timeout: time.Second * 10,
			}
			var req *http.Request
			var err error

			req, err = http.NewRequest(ag.method, ag.endpoint, nil)
			if err != nil {
				tt.Error(err)
				wg.Done()
				return
			}

			resp, err := client.Do(req)
			if err != nil {
				tt.Error(err)
				wg.Done()
				return
			}
			defer func() {
				err = resp.Body.Close()
				if err != nil {
					tt.Error(err)
					wg.Done()
					return
				}
			}()
			bts, err := io.ReadAll(resp.Body)
			if err != nil {
				tt.Error(err)
				wg.Done()
				return
			}
			fmt.Println(string(bts))
			if resp.StatusCode != ag.spectedStatus && resp.StatusCode != http.StatusBadRequest {
				tt.Errorf("status code error: %d %s", resp.StatusCode, resp.Status)
				wg.Done()
				return
			}

			wg.Done()
		}(i)
	}
	wg.Wait()
}
