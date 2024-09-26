package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/user_repository"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestUpdateUserHandler(t *testing.T) {
	t.Run("it should update an user", testutils.RunTest(func(t *testing.T) {
		user, err := testdata.CreateUser()
		if err != nil {
			t.Fatal(err)
		}

		newUser := handler.UpdateUserRequest{
			Active:    testutils.Pointer(false),
			FirstName: "John Update",
			LastName:  "Doe Update",
			Password:  "12345",
			Email:     "johndoe@testupdate.com",
		}

		response := testutils.SendRequestWithToken(t, http.MethodPut, fmt.Sprintf("user/%d", user.ID), user, newUser)

		expectedResponse := false

		body, err := io.ReadAll(response.Body)
		if err != nil {
			t.Fatal(err)
		}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		updatedUser, err := user_repository.New().GetOneByEmail(context.TODO(), "johndoe@testupdate.com")

		assert.Equal(t, http.StatusOK, response.StatusCode)
		assert.True(t, expectedResponse)
		assert.Nil(t, err)
		assert.Equal(t, newUser.Email, updatedUser.Email)
		assert.Equal(t, newUser.FirstName, updatedUser.FirstName)
		assert.Equal(t, newUser.LastName, updatedUser.LastName)
		assert.Equal(t, *newUser.Active, *updatedUser.Active)
	}))
}
