package api

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"testing"

	"net/http/httptest"

	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/util"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/healthcheck", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	h := &Handler{}

	if assert.NoError(t, h.Healthcheck(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "OK", rec.Body.String())
	}
}

func TestConvertAmount(t *testing.T) {
	e := echo.New()

	q := make(url.Values)
	q.Set("amount", "20.95")
	q.Set("from", "BRL")
	q.Set("to", "EUR")

	req := httptest.NewRequest(http.MethodGet, "/converter?"+q.Encode(), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	h := &Handler{
		DBController: controller.DBController{
			Database: &util.FakeDB{
				ErrHMGet:      nil,
				ResponseHMGet: []float64{2.54, 6.23},
			},
		},
	}

	expectedResponse, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"result":  51.39,
	})
	if assert.NoError(t, h.Converter(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		body, _ := ioutil.ReadAll(rec.Body)
		assert.Equal(t, expectedResponse, body)
	}
}

func TestConvertAmountWrongParameters(t *testing.T) {
	e := echo.New()

	q := make(url.Values)
	q.Set("amount", "20.95")
	q.Set("from", "BRL")
	q.Set("to", "EUR")

	req := httptest.NewRequest(http.MethodGet, "/converter?"+q.Encode(), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	h := &Handler{
		DBController: controller.DBController{
			Database: &util.FakeDB{
				ErrHMGet:      nil,
				ResponseHMGet: []float64{0, 6.23},
			},
		},
	}

	expectedResponse, _ := json.Marshal(map[string]interface{}{
		"success": false,
		"message": errParameter.Error(),
	})
	if assert.NoError(t, h.Converter(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Equal(t, string(expectedResponse), rec.Body.String())
	}
}

func TestConvertAmountErrDB(t *testing.T) {
	e := echo.New()

	q := make(url.Values)
	q.Set("amount", "20.95")
	q.Set("from", "BRL")
	q.Set("to", "EUR")

	req := httptest.NewRequest(http.MethodGet, "/converter?"+q.Encode(), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	h := &Handler{
		DBController: controller.DBController{
			Database: &util.FakeDB{
				ErrHMGet: errors.New("some error"),
			},
		},
	}

	expectedResponse, _ := json.Marshal(map[string]interface{}{
		"success": false,
		"message": errDb.Error(),
	})
	if assert.NoError(t, h.Converter(c)) {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Equal(t, string(expectedResponse), rec.Body.String())
	}
}
