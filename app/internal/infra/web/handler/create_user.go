package handler

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type CreateUserHandler struct {
	useCase usecase.CreateUserUseCase
}

type CreateUserRequest struct {
	Active    *bool  `json:"active,omitempty" example:"true"`
	FirstName string `json:"first_name" example:"John"`
	LastName  string `json:"last_name" example:"Doe"`
	Password  string `json:"password" example:"12$a@3$@00!"`
	Email     string `json:"email" example:"johndoe@gmail.com"`
}
type CreateUserResponse struct {
	CreatedAt time.Time `json:"created_at" example:"2024-08-31T14:21:38-03:00"`
	UpdatedAt time.Time `json:"updated_at" example:"2024-08-31T14:21:38-03:00"`
	Active    *bool     `json:"active" example:"true"`
	FirstName string    `json:"first_name" example:"John"`
	LastName  string    `json:"last_name" example:"Doe"`
	Password  string    `json:"password" example:"AasEsF!@#$%!2"`
	Email     string    `json:"email" example:"johndoe@gmail.com"`
	Role      enum.Role `json:"role" example:"user"`
	ID        int       `json:"id,omitempty" example:"1"`
}

func (h CreateUserRequest) MapToDomain() entity.User {
	return entity.User{
		Active:    h.Active,
		FirstName: h.FirstName,
		LastName:  h.LastName,
		Password:  h.Password,
		Email:     h.Email,
	}
}

func (h CreateUserRequest) Valid() error {
	reqErrors := []string{}

	if h.FirstName == "" {
		reqErrors = append(reqErrors, "first_name is required")
	}

	if h.LastName == "" {
		reqErrors = append(reqErrors, "last_name is required")
	}
	if h.Password == "" {
		reqErrors = append(reqErrors, "password is required")
	}
	if h.Email == "" {
		reqErrors = append(reqErrors, "email is required")
	}

	if len(reqErrors) > 0 {
		return errors.New(strings.Join(reqErrors, ", "))
	}

	return nil
}

func (h CreateUserResponse) MapToResponse(u entity.User) CreateUserResponse {
	return CreateUserResponse{
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
		Active:    u.Active,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Password:  u.Password,
		Email:     u.Email,
		Role:      u.Role,
		ID:        u.ID,
	}
}

// CreateUser godoc
//
//	@Summary		Create User
//	@Description	create an user
//	@Tags			Users
//	@Accept			json
//	@Produce		json
//	@Param			user	body		CreateUserRequest	true	"new user"
//	@Success		201		{object}	CreateUserResponse
//	@Failure		500		{object}	exception.InternalServerException
//	@Failure		400		{object}	exception.BadRequestException
//	@Router			/user [post]
func (h CreateUserHandler) Execute(c *gin.Context) {
	body := CreateUserRequest{}

	readBody(c, &body)

	err := body.Valid()

	if err != nil {
		panic(exception.BadRequest(err.Error()))
	}

	user := h.useCase.Execute(c, body.MapToDomain())

	res := CreateUserResponse{}

	c.JSON(http.StatusCreated, res.MapToResponse(user))
}

func NewCreateUserHandler(useCase usecase.CreateUserUseCase) CreateUserHandler {
	return CreateUserHandler{
		useCase: useCase,
	}
}
