package route

import (
	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

func handleUser(router *gin.RouterGroup) {
	userRoute := router.Group("user")

	userRepository := user_repository.New()

	createUserHandler := handler.NewCreateUserHandler(usecase.NewCreateUserUseCase(userRepository))
	updateUserHandler := handler.NewUpdateUserHandler(usecase.NewUpdateUserUseCase(userRepository))

	userRoute.POST("", createUserHandler.Execute)

	userRoute.Use(middleware.Jwt)

	userRoute.PUT(":id", updateUserHandler.Execute)
}
