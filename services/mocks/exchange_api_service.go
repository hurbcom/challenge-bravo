// Code genecurrencyd by MockGen. DO NOT EDIT.
// Source: exchange_api_service.go

// Package mock_services is a genecurrencyd GoMock package.
package mock_services

import (
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	models "github.com/victorananias/challenge-bravo/models"
)

// MockIExchangeApiService is a mock of IExchangeApiService interface.
type MockIExchangeApiService struct {
	ctrl     *gomock.Controller
	recorder *MockIExchangeApiServiceMockRecorder
}

// MockIExchangeApiServiceMockRecorder is the mock recorder for MockIExchangeApiService.
type MockIExchangeApiServiceMockRecorder struct {
	mock *MockIExchangeApiService
}

// NewMockIExchangeApiService creates a new mock instance.
func NewMockIExchangeApiService(ctrl *gomock.Controller) *MockIExchangeApiService {
	mock := &MockIExchangeApiService{ctrl: ctrl}
	mock.recorder = &MockIExchangeApiServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIExchangeApiService) EXPECT() *MockIExchangeApiServiceMockRecorder {
	return m.recorder
}

// CurrentValue mocks base method.
func (m *MockIExchangeApiService) CurrentValue(arg0, arg1 string) (models.Currency, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CurrentValue", arg0, arg1)
	ret0, _ := ret[0].(models.Currency)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CurrentValue indicates an expected call of CurrentValue.
func (mr *MockIExchangeApiServiceMockRecorder) CurrentValue(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CurrentValue", reflect.TypeOf((*MockIExchangeApiService)(nil).CurrentValue), arg0, arg1)
}
