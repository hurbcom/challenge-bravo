package testdata

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

func CreateUser() (entity.User, error) {
	zeroValue := entity.User{}

	user, err := user_repository.New().Create(context.TODO(), entity.User{
		FirstName: "John",
		LastName:  "Doe",
		Password:  "123",
		Email:     "johndoe@test.com",
		Role:      "user",
	})

	if err != nil {
		return zeroValue, err
	}

	return user, nil
}

func CreateAdminUser() (entity.User, error) {
	zeroValue := entity.User{}

	user, err := user_repository.New().Create(context.TODO(), entity.User{
		FirstName: "John",
		LastName:  "Doe",
		Password:  "123",
		Email:     "johndoe@test.com",
		Role:      "admin",
	})

	if err != nil {
		return zeroValue, err
	}

	return user, nil
}

func CreateUserWithEncryptedPassword(password string) (entity.User, error) {
	zeroValue := entity.User{}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return zeroValue, err
	}

	user, err := user_repository.New().Create(context.TODO(), entity.User{
		FirstName: "John",
		LastName:  "Doe",
		Password:  hashedPassword,
		Email:     "johndoe@test.com",
		Role:      "user",
	})

	if err != nil {
		return zeroValue, err
	}

	return user, nil
}
