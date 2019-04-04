package util

type FakeDB struct {
	ErrHMGet      error
	ErrHMSet      error
	ResponseHMGet []float64
}

func (f *FakeDB) Connect() {}

func (f *FakeDB) HMGet(args []interface{}) ([]float64, error) {
	return f.ResponseHMGet, f.ErrHMGet
}

func (f *FakeDB) HMSet(args []interface{}) error {
	return f.ErrHMSet
}

type FakeCurrencyAPICaller struct {
	Response []byte
	Err      error
}

func (f *FakeCurrencyAPICaller) CallAPI(method, path string, body []byte) ([]byte, error) {
	return f.Response, f.Err
}

type FakeCryptoCurrencyAPICaller struct {
	Response []byte
	Err      error
}

func (f *FakeCryptoCurrencyAPICaller) CallAPI(method, path string, formValues map[string]string) ([]byte, error) {
	return f.Response, f.Err
}
