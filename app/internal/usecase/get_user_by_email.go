package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
)

type GetUseByEmailUseCase struct {
	repository entity.UserRepository
}

func (u GetUseByEmailUseCase) Execute(c context.Context, email string) (*entity.User, error) {
	user, err := u.repository.GetOneByEmail(c, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func NewGetUseByEmailUseCase(repository entity.UserRepository) GetUseByEmailUseCase {
	return GetUseByEmailUseCase{
		repository: repository,
	}
}
