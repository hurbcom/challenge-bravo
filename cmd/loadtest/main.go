package main

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

var mutex = sync.Mutex{}
var totalTime = .0

const reqsAmount = 1000
const apiPort = 8314

func main() {
	wg := &sync.WaitGroup{}
	wg.Add(reqsAmount)
	for i := 0; i < reqsAmount; i++ {
		go request(wg, apiPort)
		time.Sleep(time.Microsecond * 100)
	}
	wg.Wait()
	fmt.Printf("Request time avg %s\n", time.Duration(totalTime/float64(reqsAmount)))
	fmt.Printf("Time for %d requests: %s\n", reqsAmount, time.Duration(totalTime))
}

func request(wg *sync.WaitGroup, port int) {
	defer wg.Done()
	amount := rand.Float64() * 100000
	start := time.Now()
	response, err := http.Get(fmt.Sprintf("http://localhost:%d/convert?from=BTC&to=BRL&amount=%f", port, amount))
	elapsed := time.Since(start)
	mutex.Lock()
	totalTime += float64(elapsed)
	mutex.Unlock()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer response.Body.Close()
	if response.StatusCode >= 400 {
		err = fmt.Errorf("Request error. Status code: %d", response.StatusCode)
		fmt.Println(err)
		return
	}
	_, err = ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
}
