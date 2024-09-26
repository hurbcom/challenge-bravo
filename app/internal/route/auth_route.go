package route

import (
	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

func handleAuth(router *gin.RouterGroup) {
	authRoute := router.Group("auth")

	signInHandler := handler.NewSignInHandler(usecase.NewSignInUseCase(user_repository.New()))

	authRoute.POST("", signInHandler.Execute)
}
