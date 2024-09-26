package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/service"
)

func getIdFromReq(c *gin.Context) int {
	id := c.Param("id")

	intId, err := strconv.Atoi(id)
	if err != nil {
		panic(exception.BadRequest(fmt.Sprintf("invalid id parameter %s", id)))
	}

	return intId
}

func getParamAsString(c *gin.Context, param string) string {
	p := c.Param(param)

	return p
}

func getUuidFromReq(c *gin.Context) uuid.UUID {
	uuidRequest := c.Param("uuid")

	parsedUuid, err := uuid.Parse(uuidRequest)
	if err != nil {
		panic(exception.BadRequest(fmt.Sprintf("invalid uuid parameter %s", uuidRequest)))
	}

	return parsedUuid
}

func readBody[B any](c *gin.Context, body *B) {
	err := c.ShouldBindJSON(body)
	if err == io.EOF {
		panic(exception.BadRequest("empty request body"))
	}
	if err != nil {
		panic(exception.BadRequest(err.Error()))
	}
}

func getUserClaims(c *gin.Context) service.JwtClaims {
	user, ok := c.Get("user")

	if !ok {
		panic(exception.InternalServer("access not authorized"))
	}

	claims := service.JwtClaims{}

	user, ok = user.([]byte)
	if !ok {
		panic(exception.InternalServer(fmt.Sprintf("expected user request []byte, receive %T", user)))
	}

	err := json.Unmarshal(user.([]byte), &claims)

	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return claims
}
