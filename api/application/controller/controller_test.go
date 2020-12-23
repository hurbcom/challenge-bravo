package controller

import (
	"errors"
	"github.com/iiurydias/challenge-bravo/api/cache"
	. "github.com/onsi/gomega"
	"testing"
)

func TestAddCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockClient{
		addCurrencyFunc: func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return nil
		},
	}, nil)
	err := cntroller.AddCurrency("USD")
	Expect(err).ShouldNot(HaveOccurred())
}

func TestAddCurrencyWithFailure(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockClient{
		addCurrencyFunc: func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return errors.New("failed")
		},
	}, nil)
	err := cntroller.AddCurrency("USD")
	Expect(err).Should(HaveOccurred())
}

func TestRemoveCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockClient{
		removeCurrencyFunc: func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return nil
		},
	}, nil)
	err := cntroller.RemoveCurrency("USD")
	Expect(err).ShouldNot(HaveOccurred())
}

func TestRemoveCurrencyWithFailure(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(&MockClient{
		removeCurrencyFunc: func(code string) error {
			Expect(code).Should(BeEquivalentTo("USD"))
			return errors.New("failed")
		},
	}, nil)
	err := cntroller.RemoveCurrency("USD")
	Expect(err).Should(HaveOccurred())
}

func TestConvertingCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCache{
		getFunc: func(key string) (float64, error) {
			switch key {
			case "BRL":
				return 5.3, nil
			case "USD":
				return 1, nil
			default:
				return 0, nil
			}
		},
	})
	result, err := cntroller.ConvertCurrency("BRL", "USD", 10.6)
	Expect(err).ShouldNot(HaveOccurred())
	Expect(result).Should(BeEquivalentTo(float64(2)))
}

func TestConvertingCurrencyWithFailureGettingFromCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCache{
		getFunc: func(key string) (float64, error) {
			switch key {
			case "BRL":
				return 5.3, errors.New("failed")
			case "USD":
				return 1, nil
			default:
				return 0, nil
			}
		},
	})
	result, err := cntroller.ConvertCurrency("BRL", "USD", 10.6)
	Expect(err).Should(HaveOccurred())
	Expect(result).Should(BeZero())
}

func TestConvertingCurrencyWithFailureGettingToCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCache{
		getFunc: func(key string) (float64, error) {
			switch key {
			case "BRL":
				return 5.3, nil
			case "USD":
				return 1, errors.New("failed")
			default:
				return 0, nil
			}
		},
	})
	result, err := cntroller.ConvertCurrency("BRL", "USD", 10.6)
	Expect(err).Should(HaveOccurred())
	Expect(result).Should(BeZero())
}

func TestConvertingCurrencyFromANotFoundCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCache{
		getFunc: func(key string) (float64, error) {
			switch key {
			case "BRL":
				return 5.3, cache.ErrNotFound
			case "USD":
				return 1, nil
			default:
				return 0, nil
			}
		},
	})
	result, err := cntroller.ConvertCurrency("BRL", "USD", 10.6)
	Expect(err).Should(HaveOccurred())
	Expect(result).Should(BeZero())
}

func TestConvertingCurrencyToANotFoundCurrency(t *testing.T) {
	RegisterTestingT(t)
	cntroller := New(nil, &MockCache{
		getFunc: func(key string) (float64, error) {
			switch key {
			case "BRL":
				return 5.3, nil
			case "USD":
				return 1, cache.ErrNotFound
			default:
				return 0, nil
			}
		},
	})
	result, err := cntroller.ConvertCurrency("BRL", "USD", 10.6)
	Expect(err).Should(HaveOccurred())
	Expect(result).Should(BeZero())
}

type MockClient struct {
	addCurrencyFunc    func(code string) error
	removeCurrencyFunc func(code string) error
}

func (m *MockClient) AddCurrency(code string) error {
	return m.addCurrencyFunc(code)
}
func (m *MockClient) RemoveCurrency(code string) error {
	return m.removeCurrencyFunc(code)
}

type MockCache struct {
	getFunc func(key string) (float64, error)
}

func (m *MockCache) Get(key string) (float64, error) {
	return m.getFunc(key)
}
func (m *MockCache) Close() error {
	return nil
}
