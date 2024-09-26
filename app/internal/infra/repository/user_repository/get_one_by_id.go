package user_repository

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/user_connection"
)

func GetOneByIdMapToEntity(p user_connection.User) *entity.User {
	return &entity.User{
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
		Active:    &p.Active,
		FirstName: p.FirstName,
		LastName:  p.LastName,
		Password:  p.Password,
		Email:     p.Email,
		Role:      enum.Role(p.Role),
		ID:        p.ID,
	}
}

func (u UserRepository) GetOneById(c context.Context, id int) (*entity.User, error) {
	user, err := u.queries.GetOneById(c, id)
	if err != nil {
		return nil, err
	}

	return GetOneByIdMapToEntity(user), nil
}
