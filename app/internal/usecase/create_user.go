package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

type CreateUserUseCase struct {
	repository entity.UserRepository
}

func (u CreateUserUseCase) Execute(c context.Context, p entity.User) entity.User {
	p.Role = enum.USER

	hash, err := utils.HashPassword(p.Password)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	p.Password = hash

	user, err := u.repository.Create(c, p)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}

	return user
}

func NewCreateUserUseCase(repository entity.UserRepository) CreateUserUseCase {
	return CreateUserUseCase{
		repository: repository,
	}
}
