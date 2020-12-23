package handlers

import "github.com/gin-gonic/gin"

type Handlers interface {
	AddCurrency() gin.HandlerFunc
	RemoveCurrency() gin.HandlerFunc
	ConvertCurrency() gin.HandlerFunc
}
