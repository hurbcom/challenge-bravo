package user_repository

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/user_connection"
)

func CreateMapToDB(u entity.User) user_connection.CreateParams {
	return user_connection.CreateParams{
		Role:      user_connection.Roles(u.Role),
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Password:  u.Password,
	}
}

func CreateMapToEntity(u user_connection.User) entity.User {
	return entity.User{
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
		Active:    &u.Active,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Password:  u.Password,
		Email:     u.Email,
		Role:      enum.Role(u.Role),
		ID:        u.ID,
	}
}

func (u UserRepository) Create(c context.Context, user entity.User) (entity.User, error) {
	newUser, err := u.queries.Create(c, CreateMapToDB(user))
	if err != nil {
		return entity.User{}, err
	}

	return CreateMapToEntity(newUser), nil
}
