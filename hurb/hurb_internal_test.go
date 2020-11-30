package hurb

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"testing"
	"time"
)

var (
	count  = 1
	loopWG sync.WaitGroup
	apiKey = "3d5e872f50dc9748fe08"
)

type testme struct {
	t     *testing.T
	mongo db
	close func()
}

func TestHurb(t *testing.T) {
	test := testme{t: t}
	test.t.Log("setting test")
	test.startServer()
	defer test.close()
	time.Sleep(1 * time.Second)

	test.stressTest()
	test.listsTests()

	test.mongoDB()
	defer test.mongo.close()
}

func (test *testme) mongoDB() error {
	test.t.Log("starting mongodb test")
	client, err := newMongoClient()
	if err != nil {
		return err
	}
	test.mongo = client
	return nil
}

func (test *testme) startServer() {
	var wg sync.WaitGroup
	test.t.Log("starting server")
	wg.Add(1)
	go startServer()
	test.close = func() {
		test.t.Log("closing server")
		wg.Done()
	}
}

func (test *testme) stressTest() {
	test.t.Log("starting stress test")
	previously := len(errList)
	for i := 0; i < count; i++ {
		loopWG.Add(1)
		go test.exchangeTest(i)
	}
	loopWG.Wait()
	if len(errList) != previously {
		errOutput := ""
		for i := range errList {
			errOutput += fmt.Sprintf("\nstress test %02d: %v", i, errList[i])
		}
		test.t.Fatal(errOutput)
	}
}

func (test *testme) exchangeTest(i int) error {
	test.t.Log("starting exchange test")
	defer loopWG.Done()
	test.t.Logf("exchange test %d", i)

	url := "http://localhost:8888/exchange?from=btc&to=brl&amount=1&key=" + apiKey

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		errList = append(errList, fmt.Errorf("err from exchangeTest: %v", err))
		return err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		errList = append(errList, fmt.Errorf("err from exchangeTest: %v", err))
		return err
	}

	defer res.Body.Close()
	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		errList = append(errList, fmt.Errorf("err from exchangeTest: %v", err))
		return err
	}
	test.t.Logf("finished test %d", i)
	return nil
}
func (test *testme) listsTests() {
	test.t.Log("starting lists test")
	curr, err := map[string]string{}, fmt.Errorf("")

	curr, err = listCurrencyTest("abcdefg", true)
	if err == nil {
		test.t.Fatalf("returned <nil> when it should be non-nil: %+v", curr)
	}

	curr, err = listCurrencyTest("ltc", true)
	if err != nil {
		test.t.Fatal(err)
	}
	_, ok := curr["error"]
	if ok {
		test.t.Fatalf("%v", curr["error"])
	}

	curr, err = listCurrencyTest("abcdefg", false)
	if err == nil {
		test.t.Fatalf("returned <nil> when it should be non-nil: %+v", curr)
	}

	curr, err = listCurrencyTest("nok", false)
	if err != nil {
		test.t.Fatal(err)
	}
	_, ok = curr["error"]
	if ok {
		test.t.Fatalf("%v", curr["error"])
	}

	test.t.Log("finished currencies listing test")
}

func listCurrencyTest(currency string, cryto bool) (map[string]string, error) {
	body, err := defaultRequest(fmt.Sprintf("http://localhost:8888/list?currency=%s&isCrypto=%t", currency, cryto))
	if err != nil {
		return map[string]string{}, err
	}
	args := map[string]string{}
	err = json.Unmarshal([]byte(body), &args)
	if err != nil {
		return args, err
	}
	_, ok := args["error"]
	if ok {
		return map[string]string{}, fmt.Errorf(args["error"])
	}
	return args, nil
}
