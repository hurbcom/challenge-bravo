package api

import (
	"errors"
	"testing"

	"gotest.tools/assert"

	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/log"
	"github.com/hurbcom/challenge-bravo/util"
)

func TestCalculateConversion(t *testing.T) {

	errTest := errors.New("some error")
	log.Init()
	type testStructure struct {
		controller controller.DBController
		amount     float64
	}

	tests := []testStructure{
		{
			controller.DBController{
				Database: &util.FakeDB{nil, nil, []float64{1.54, 5.67}},
			},
			5.34},
		{
			controller.DBController{
				Database: &util.FakeDB{nil, nil, []float64{4.56, 2.78}},
			},
			20.43},
		{
			controller.DBController{&util.FakeDB{nil, nil, []float64{0, 1.43}}},
			6.23},
		{
			controller.DBController{&util.FakeDB{nil, nil, []float64{5.43, 0}}},
			5.53},
		{
			controller.DBController{&util.FakeDB{nil, nil, []float64{0, 0}}},
			34.51},
		{
			controller.DBController{&util.FakeDB{errTest, nil, nil}},
			4.86},
	}
	expectedResults := []struct {
		err    error
		result float64
	}{
		{nil, 19.66},
		{nil, 12.46},
		{errParameter, -1},
		{errParameter, -1},
		{errParameter, -1},
		{errDb, -1},
	}

	for i, test := range tests {
		response, err := calculate(test.controller, ConverterRequest{"BRL", "USD", test.amount})
		assert.Equal(t, err, expectedResults[i].err)
		assert.Equal(t, response, expectedResults[i].result)
	}

}
