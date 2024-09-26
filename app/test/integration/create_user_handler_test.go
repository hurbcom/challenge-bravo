package integration

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestCreateUserHandler(t *testing.T) {
	t.Run("it should create an user", testutils.RunTest(func(t *testing.T) {
		newUser := handler.CreateUserRequest{
			Active:    testutils.Pointer(true),
			FirstName: "John",
			LastName:  "Doe",
			Password:  "123",
			Email:     "johndoe@test.com",
		}

		response := testutils.SendRequest(t, http.MethodPost, "user", newUser)

		expectedUser := handler.CreateUserResponse{}

		body, err := io.ReadAll(response.Body)
		if err != nil {
			t.Fatal(err)
		}

		if err := json.Unmarshal(body, &expectedUser); err != nil {
			t.Fatal(err)
		}

		user, err := user_repository.New().GetOneByEmail(context.TODO(), "johndoe@test.com")

		assert.Equal(t, http.StatusCreated, response.StatusCode)
		assert.Nil(t, err)
		assert.NotNil(t, user)
		assert.NotNil(t, expectedUser.ID)
		assert.Equal(t, newUser.Active, expectedUser.Active)
		assert.Equal(t, newUser.FirstName, expectedUser.FirstName)
		assert.Equal(t, newUser.LastName, expectedUser.LastName)
		assert.Equal(t, newUser.Email, expectedUser.Email)
		assert.NotEqual(t, newUser.Password, expectedUser.Password)
	}))
}
