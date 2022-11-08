package handlers

import (
	"net/http"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type conversionHandler struct {
	conversionUsecase usecases.ConversionUsecase
}

type ConversionHandler interface {
	Convert(c *gin.Context)
}

func InitializeConversionHandler(usecase usecases.ConversionUsecase) ConversionHandler {
	return &conversionHandler{usecase}
}

func (handler *conversionHandler) Convert(c *gin.Context) {
	var conversion entities.Conversion

	c.JSON(http.StatusOK, conversion)
}
