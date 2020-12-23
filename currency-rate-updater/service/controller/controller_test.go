package controller

import (
	"errors"
	. "github.com/onsi/gomega"
	"testing"
)

func TestAddingAValidNewCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockCacheModule{
		setFunc: func(key string, value float64) error {
			Expect(key).Should(BeEquivalentTo("USD"))
			Expect(value).Should(BeEquivalentTo(1.22))
			return nil
		},
	}, &MockCurrencyModule{
		getCurrencyRateFunc: func(code string) (float64, error) {
			Expect(code).Should(BeEquivalentTo("USD"))
			return 1.22, nil
		},
	}, []string{"EUR"})
	err := cntroller.AddCurrency("USD")
	Expect(err).ShouldNot(HaveOccurred())
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR", "USD"}))
}

func TestAddingAValidNewCurrencyFailingOnSet(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockCacheModule{
		setFunc: func(key string, value float64) error {
			Expect(key).Should(BeEquivalentTo("USD"))
			Expect(value).Should(BeEquivalentTo(1.22))
			return errors.New("failed")
		},
	}, &MockCurrencyModule{
		getCurrencyRateFunc: func(code string) (float64, error) {
			Expect(code).Should(BeEquivalentTo("USD"))
			return 1.22, nil
		},
	}, []string{"EUR"})
	err := cntroller.AddCurrency("USD")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("failed to add to cache currency called USD: failed"))
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR"}))
}

func TestAddingAInvalidNewCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCurrencyModule{
		getCurrencyRateFunc: func(code string) (float64, error) {
			Expect(code).Should(BeEquivalentTo("USD"))
			return 0, errors.New("currency does not exist")
		},
	}, []string{"EUR"})
	err := cntroller.AddCurrency("USD")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("currency does not exist"))
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR"}))
}

func TestAddingAAlreadyExistingCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, nil, []string{"EUR"})
	err := cntroller.AddCurrency("EUR")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("currency already exist"))
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR"}))
}

func TestRemovingAValidCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockCacheModule{
		deleteFunc: func(key string) error {
			Expect(key).Should(BeEquivalentTo("USD"))
			return nil
		},
	}, nil, []string{"EUR", "USD"})
	err := cntroller.RemoveCurrency("USD")
	Expect(err).ShouldNot(HaveOccurred())
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR"}))
}

func TestRemovingAValidCurrencyWithFailure(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockCacheModule{
		deleteFunc: func(key string) error {
			Expect(key).Should(BeEquivalentTo("USD"))
			return errors.New("failed")
		},
	}, nil, []string{"EUR", "USD"})
	err := cntroller.RemoveCurrency("USD")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("failed to remove from cache currency called USD: failed"))
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR", "USD"}))
}

func TestRemovingANonexistentCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockCacheModule{
		deleteFunc: func(key string) error {
			Expect(key).Should(BeEquivalentTo("USD"))
			return nil
		},
	}, nil, []string{"EUR", "USD"})
	err := cntroller.RemoveCurrency("BRL")
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("currency does not exist"))
	Expect(cntroller.GetAllowedCurrencies()).Should(BeEquivalentTo([]string{"EUR", "USD"}))
}

func TestUpdatingCurrencies(t *testing.T) {
	RegisterTestingT(t)
	counter := 0
	cntroller := New(&MockCacheModule{
		setFunc: func(key string, value float64) error {
			switch key {
			case "USD":
				counter++
				Expect(value).Should(BeEquivalentTo(5.2))
			case "BRL":
				counter++
				Expect(value).Should(BeEquivalentTo(2.1))
			case "EUR":
				counter++
				Expect(value).Should(BeEquivalentTo(6.4))
			}
			return nil
		},
	}, &MockCurrencyModule{
		getAllCurrenciesRateFunc: func() (map[string]float64, error) {
			return map[string]float64{"USD": 5.2, "BRL": 2.1, "EUR": 6.4}, nil
		},
	}, []string{"EUR", "BRL", "USD"})
	err := cntroller.UpdateCurrencies()
	Expect(err).ShouldNot(HaveOccurred())
	Expect(counter).Should(BeEquivalentTo(3))
}

func TestUpdatingCurrenciesWithFailureOnGet(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCurrencyModule{
		getAllCurrenciesRateFunc: func() (map[string]float64, error) {
			return nil, errors.New("failed")
		},
	}, []string{"EUR", "BRL", "USD"})
	err := cntroller.UpdateCurrencies()
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("failed"))
}

func TestUpdatingOnlyAllowedCurrencies(t *testing.T) {
	RegisterTestingT(t)
	counter := 0
	cntroller := New(&MockCacheModule{
		setFunc: func(key string, value float64) error {
			switch key {
			case "USD":
				counter++
				Expect(value).Should(BeEquivalentTo(5.2))
			case "BRL":
				counter++
				Expect(value).Should(BeEquivalentTo(2.1))
			case "EUR":
				counter++
				Expect(value).Should(BeEquivalentTo(6.4))
			case "CAD":
				counter++
				Expect(value).Should(BeEquivalentTo(2.3))
			}
			return nil
		},
	}, &MockCurrencyModule{
		getAllCurrenciesRateFunc: func() (map[string]float64, error) {
			return map[string]float64{"USD": 5.2, "CAD": 2.3, "BRL": 2.1, "EUR": 6.4}, nil
		},
	}, []string{"EUR", "BRL", "USD"})
	err := cntroller.UpdateCurrencies()
	Expect(err).ShouldNot(HaveOccurred())
	Expect(counter).Should(BeEquivalentTo(3))
}

func TestUpdatingCurrenciesWithOneFailure(t *testing.T) {
	RegisterTestingT(t)
	counter := 0
	cntroller := New(&MockCacheModule{
		setFunc: func(key string, value float64) error {
			switch key {
			case "USD":
				counter++
				Expect(value).Should(BeEquivalentTo(5.2))
				return errors.New("failed")
			case "BRL":
				counter++
				Expect(value).Should(BeEquivalentTo(2.1))
				return nil
			case "EUR":
				counter++
				Expect(value).Should(BeEquivalentTo(6.4))
				return nil
			}
			return nil
		},
	}, &MockCurrencyModule{
		getAllCurrenciesRateFunc: func() (map[string]float64, error) {
			return map[string]float64{"USD": 5.2, "BRL": 2.1, "EUR": 6.4}, nil
		},
	}, []string{"EUR", "BRL", "USD"})
	err := cntroller.UpdateCurrencies()
	Expect(err).ShouldNot(HaveOccurred())
	Expect(counter).Should(BeEquivalentTo(3))
}

type MockCacheModule struct {
	setFunc    func(key string, value float64) error
	deleteFunc func(key string) error
}

func (m *MockCacheModule) Set(key string, value float64) error {
	return m.setFunc(key, value)
}
func (m *MockCacheModule) Delete(key string) error {
	return m.deleteFunc(key)
}
func (m *MockCacheModule) Close() error {
	return nil
}

type MockCurrencyModule struct {
	getCurrencyRateFunc      func(code string) (float64, error)
	getAllCurrenciesRateFunc func() (map[string]float64, error)
}

func (m *MockCurrencyModule) GetCurrencyRate(code string) (float64, error) {
	return m.getCurrencyRateFunc(code)
}
func (m *MockCurrencyModule) GetAllCurrenciesRate() (map[string]float64, error) {
	return m.getAllCurrenciesRateFunc()
}
