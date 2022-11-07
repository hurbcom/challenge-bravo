// Code genecurrencyd by MockGen. DO NOT EDIT.
// Source: currencies_repository.go

// Package mock_repositories is a genecurrencyd GoMock package.
package mock_repositories

import (
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	models "github.com/victorananias/challenge-bravo/models"
)

// MockICurrenciesRepository is a mock of ICurrenciesRepository interface.
type MockICurrenciesRepository struct {
	ctrl     *gomock.Controller
	recorder *MockICurrenciesRepositoryMockRecorder
}

// MockICurrenciesRepositoryMockRecorder is the mock recorder for MockICurrenciesRepository.
type MockICurrenciesRepositoryMockRecorder struct {
	mock *MockICurrenciesRepository
}

// NewMockICurrenciesRepository creates a new mock instance.
func NewMockICurrenciesRepository(ctrl *gomock.Controller) *MockICurrenciesRepository {
	mock := &MockICurrenciesRepository{ctrl: ctrl}
	mock.recorder = &MockICurrenciesRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockICurrenciesRepository) EXPECT() *MockICurrenciesRepositoryMockRecorder {
	return m.recorder
}

// CreateOrUpdate mocks base method.
func (m *MockICurrenciesRepository) CreateOrUpdate(arg0 models.Currency) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateOrUpdate", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// CreateOrUpdate indicates an expected call of CreateOrUpdate.
func (mr *MockICurrenciesRepositoryMockRecorder) CreateOrUpdate(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateOrUpdate", reflect.TypeOf((*MockICurrenciesRepository)(nil).CreateOrUpdate), arg0)
}

// DeleteByCurrencyCode mocks base method.
func (m *MockICurrenciesRepository) DeleteByCurrencyCode(arg0 string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteByCurrencyCode", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteByCurrencyCode indicates an expected call of DeleteByCurrencyCode.
func (mr *MockICurrenciesRepositoryMockRecorder) DeleteByCurrencyCode(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteByCurrencyCode", reflect.TypeOf((*MockICurrenciesRepository)(nil).DeleteByCurrencyCode), arg0)
}

// GetCurrency mocks base method.
func (m *MockICurrenciesRepository) GetCurrency(arg0, arg1 string) (models.Currency, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetCurrency", arg0, arg1)
	ret0, _ := ret[0].(models.Currency)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetCurrency indicates an expected call of GetCurrency.
func (mr *MockICurrenciesRepositoryMockRecorder) GetCurrency(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetCurrency", reflect.TypeOf((*MockICurrenciesRepository)(nil).GetCurrency), arg0, arg1)
}
