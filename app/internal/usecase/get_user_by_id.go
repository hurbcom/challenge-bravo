package usecase

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
)

type GetUseByIdUseCase struct {
	repository entity.UserRepository
}

func (u GetUseByIdUseCase) Execute(c context.Context, id int) (*entity.User, error) {
	user, err := u.repository.GetOneById(c, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func NewGetUseByIdUseCase(repository entity.UserRepository) GetUseByIdUseCase {
	return GetUseByIdUseCase{
		repository: repository,
	}
}
