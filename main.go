package main

import "github.com/gin-gonic/gin"

func main() {
	router := gin.Default()

	router.GET("/exchange")

	router.Run()
}
