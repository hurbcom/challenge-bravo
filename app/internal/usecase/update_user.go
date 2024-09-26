package usecase

import (
	"context"
	"time"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
)

type UpdateUserUseCase struct {
	repository entity.UserRepository
}

func (u UpdateUserUseCase) Execute(c context.Context, p entity.User) {
	p.Role = enum.USER
	p.UpdatedAt = time.Now()

	err := u.repository.Update(c, p)
	if err != nil {
		panic(exception.InternalServer(err.Error()))
	}
}

func NewUpdateUserUseCase(repository entity.UserRepository) UpdateUserUseCase {
	return UpdateUserUseCase{
		repository: repository,
	}
}
