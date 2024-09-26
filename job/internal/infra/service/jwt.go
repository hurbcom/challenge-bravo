package service

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/config"
)

type JwtService struct{}

type JwtClaims struct {
	Exp   time.Time `json:"exp"`
	Email string    `json:"email"`
	Role  string    `json:"role"`
	ID    int       `json:"id"`
}

type JwtUser struct {
	Email string
	Role  string
	ID    int
}

func (j JwtService) CreateToken(user JwtUser) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":    user.ID,
			"email": user.Email,
			"role":  user.Role,
			"exp":   time.Now().Add(time.Hour * time.Duration(config.Envs.Jwt.ExpirationInHour)).Unix(),
		})

	tokenString, err := token.SignedString([]byte(config.Envs.Jwt.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (j JwtService) VerifyToken(assignedToken string) (JwtClaims, error) {
	token, err := jwt.Parse(assignedToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.Envs.Jwt.Secret), nil
	})

	if err != nil {
		return JwtClaims{}, err
	}

	if !token.Valid {
		return JwtClaims{}, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return JwtClaims{}, fmt.Errorf("invalid claims type")
	}

	responseClaims := JwtClaims{
		Exp:   time.Unix(int64(claims["exp"].(float64)), 0),
		Email: claims["email"].(string),
		Role:  claims["role"].(string),
		ID:    int(claims["id"].(float64)),
	}

	return responseClaims, nil
}

func NewJwtService() JwtService {
	return JwtService{}
}
