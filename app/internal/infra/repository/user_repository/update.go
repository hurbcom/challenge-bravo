package user_repository

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/user_connection"
)

func UpdateMapToDB(u entity.User) user_connection.UpdateParams {
	return user_connection.UpdateParams{
		ID:        u.ID,
		Role:      user_connection.Roles(u.Role),
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		UpdatedAt: u.UpdatedAt,
	}
}

func (u UserRepository) Update(c context.Context, user entity.User) error {
	err := u.queries.Update(c, UpdateMapToDB(user))
	if err != nil {
		return err
	}

	return nil
}
