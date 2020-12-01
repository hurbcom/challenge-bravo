package hurb

import (
	"encoding/json"
	"fmt"
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
	close func()
}

func TestHurb(t *testing.T) {
	test := testme{t: t}
	test.t.Log("setting test")
	test.startServer()
	defer test.close()
	time.Sleep(1 * time.Second)

	test.stressTest()
	test.mongoDB()
	test.addCurrTest(currency{"nok", false})
	test.addCurrTest(currency{"ltc", true})
	test.rmCurrTest(currency{"nok", false})
	test.rmCurrTest(currency{"ltc", true})

}

func (test *testme) mongoDB() error {
	test.t.Log("starting mongo db test flow")
	m, err := newMongoClient()
	if err != nil {
		m.close()
		return err
	}
	defer m.close()

	_, err = m.listCurr()
	if err != nil {
		return err
	}
	test.t.Log("finished mongo db test flow")
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
	body, err := defaultRequest(url)
	if err != nil {
		return err
	}

	err = parseBody([]byte(body))
	if err != nil {
		return err
	}

	test.t.Logf("finished test %d", i)
	return nil
}

func (test *testme) addCurrTest(curr currency) {
	test.t.Logf("testing addCurr with %s currency", curr.name)
	url := fmt.Sprintf("http://localhost:8888/add?currency=%s&isCrypto=%t", curr.name, curr.crypto)
	body, err := defaultRequest(url)
	if err != nil {
		test.t.Fatal(err)
	}

	err = parseBody([]byte(body))
	if err != nil {
		test.t.Fatal(err)
	}

	test.t.Logf("successfully tested addCurr")
}

func (test *testme) rmCurrTest(curr currency) {
	test.t.Logf("testing rmCurr with %s currency", curr.name)
	url := fmt.Sprintf("http://localhost:8888/rm?currency=%s", curr.name)
	body, err := defaultRequest(url)
	if err != nil {
		test.t.Fatal(err)
	}

	err = parseBody([]byte(body))
	if err != nil {
		test.t.Fatal(err)
	}

	test.t.Logf("successfully tested rmCurr")
}

func parseBody(body []byte) error {
	output := args{}
	err := json.Unmarshal([]byte(body), &output)
	if err != nil {
		return err
	}
	_, ok := output["error"]
	if ok {
		return fmt.Errorf("%v", output["error"])
	}
	return nil
}
