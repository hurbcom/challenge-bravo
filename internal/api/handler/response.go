package handler

import "github.com/gin-gonic/gin"

// MakeResponse returns a response with the given message
func MakeResponse(message interface{}) gin.H {
	return gin.H{"data": message}
}
