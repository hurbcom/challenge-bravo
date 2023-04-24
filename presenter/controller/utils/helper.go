package utils

import (
	"github.com/VictorNapoles/challenge-bravo/usecase"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HandleError(c *gin.Context, err error) {
	switch err.(type) {
	case *usecase.UsecaseError:
		c.JSON(http.StatusBadRequest, err.Error())
	default:
		c.JSON(http.StatusInternalServerError, err.Error())
	}
}
