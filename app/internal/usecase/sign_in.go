package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/service"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

type SignInUseCase struct {
	repository entity.UserRepository
}

type SignInUseCaseParamsDto struct {
	Email    string
	Password string
}

type SignInUseCaseResponseDto struct {
	Token string
	User  entity.User
}

func (u SignInUseCase) Execute(c context.Context, params SignInUseCaseParamsDto) SignInUseCaseResponseDto {
	user, err := u.repository.GetOneByEmail(c, params.Email)
	if err != nil {
		panic(exception.BadRequest("email or password invalid"))
	}

	if !utils.IsValidPassword(user.Password, params.Password) {
		panic(exception.BadRequest("email or password invalid"))
	}

	token, err := service.NewJwtService().CreateToken(*user)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return SignInUseCaseResponseDto{
		User:  *user,
		Token: token,
	}
}

func NewSignInUseCase(repository entity.UserRepository) SignInUseCase {
	return SignInUseCase{
		repository: repository,
	}
}
