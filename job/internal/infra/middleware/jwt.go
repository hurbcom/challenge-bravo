package middleware

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/service"
)

func Jwt(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "access not authorized",
		})
		c.Abort()
		return
	}

	tokenString = strings.Split(tokenString, " ")[1]

	jwtService := service.NewJwtService()

	claims, err := jwtService.VerifyToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "access not authorized",
		})
		c.Abort()
		return
	}

	var userExists bool
	err = db.Conn.QueryRow(c, "SELECT EXISTS(SELECT 1 FROM USERS WHERE id = $1 AND role = 'admin')", claims.ID).Scan(&userExists)
	if err != nil || !userExists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "access not authorized",
		})
		c.Abort()
		return
	}

	claimsToBytes, err := json.Marshal(claims)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    http.StatusUnauthorized,
			"message": "access not authorized",
		})
		c.Abort()
		return
	}

	c.Set("user", claimsToBytes)

	c.Next()
}
