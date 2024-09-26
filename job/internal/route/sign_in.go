package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/service"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

type SignInRequest struct {
	Email    string `json:"email" example:"sa.bravo@bravo.com"`
	Password string `json:"password" example:"123"`
}

type SignInResponse struct {
	User  UserResponse
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhLmJyYXZvQGJyYXZvLmNvbSIsImV4cCI6MTcyNzQ5NzU3NiwiaWQiOjEsInJvbGUiOiJhZG1pbiJ9.kqjAxXJq3P814TAc_kCMYCDeAZarg1AvNqXNOdXmNPA"`
}

type UserResponse struct {
	ID    int    `json:"id" example:"1"`
	Email string `json:"email" example:"sa.bravo@bravo.com"`
	Role  string `json:"role" example:"admin"`
}

type User struct {
	ID       int
	Email    string
	Role     string
	Password string
}

// SignIn godoc
//
//	@Summary		Sign in
//	@Description	You need this admin login to access the endpoints
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			signInParams	body		SignInRequest	true	"data"
//	@Success		200				{object}	SignInResponse
//	@Failure		500				{object}	exception.InternalServerException
//	@Failure		400				{object}	exception.BadRequestException
//	@Router			/auth [post]
func handleSignIn(router *gin.RouterGroup) {
	router.POST("auth", func(c *gin.Context) {
		body := SignInRequest{}

		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusInternalServerError,
				"message": err.Error(),
			})
			return
		}

		user := User{}

		err := db.Conn.
			QueryRow(c, "SELECT id, email, role, password FROM users WHERE email = $1", body.Email).
			Scan(&user.ID, &user.Email, &user.Role, &user.Password)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    http.StatusBadRequest,
				"message": err.Error(),
			})
			return

		}

		if !utils.IsValidPassword(user.Password, body.Password) {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    http.StatusBadRequest,
				"message": "email or password invalid",
			})
			return
		}

		jwtUser := service.JwtUser{
			Email: user.Email,
			Role:  user.Role,
			ID:    user.ID,
		}

		token, err := service.NewJwtService().CreateToken(jwtUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusInternalServerError,
				"message": "email or password invalid",
			})
			return
		}

		res := map[string]any{
			"user": map[string]any{
				"id":    user.ID,
				"email": user.Email,
				"role":  user.Role,
			},
			"token": token,
		}

		c.JSON(http.StatusOK, res)
	})
}
