package integration

import (
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/web/handler"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testdata"
	"github.com/wesleyfebarretos/challenge-bravo/app/test/testutils"
)

func TestSignInHandler(t *testing.T) {
	t.Run("it should sign in", testutils.RunTest(func(t *testing.T) {
		password := "123"

		user, err := testdata.CreateUserWithEncryptedPassword(password)
		if err != nil {
			t.Fatal(err)
		}

		signInRequest := handler.SignInRequest{
			Email:    user.Email,
			Password: password,
		}

		response := testutils.SendRequest(t, http.MethodPost, "auth", signInRequest)

		body, err := io.ReadAll(response.Body)
		if err != nil {
			t.Fatal(err)
		}

		expectedResponse := handler.SignInResponse{}

		if err := json.Unmarshal(body, &expectedResponse); err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, http.StatusOK, response.StatusCode)
		assert.NotNil(t, expectedResponse.Token)
		assert.Equal(t, user.ID, expectedResponse.User.ID)
		assert.Equal(t, user.Email, expectedResponse.User.Email)
		assert.Equal(t, user.FirstName, expectedResponse.User.FirstName)
		assert.Equal(t, user.LastName, expectedResponse.User.LastName)
		assert.Equal(t, user.Role, expectedResponse.User.Role)
	}))
}
