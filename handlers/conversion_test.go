package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type conversionHandlerSuite struct {
	suite.Suite
	usecase *mocks.ConversionUsecase
	handler ConversionHandler
	routes  *gin.Engine
}

func (suite *conversionHandlerSuite) SetupSuite() {
	usecase := new(mocks.ConversionUsecase)
	handler := InitializeConversionHandler(usecase)

	routes := gin.Default()
	routes.GET("/conversion", handler.Convert)

	suite.routes = routes
	suite.usecase = usecase
	suite.handler = handler
}

func (suite *conversionHandlerSuite) TestConvert() {
	req, _ := http.NewRequest("GET", "/conversion", nil)
	response := httptest.NewRecorder()
	suite.routes.ServeHTTP(response, req)

	suite.Equal(http.StatusOK, response.Code)
	suite.usecase.AssertExpectations(suite.T())
}

func TestConversionHandler(t *testing.T) {
	suite.Run(t, new(conversionHandlerSuite))
}
