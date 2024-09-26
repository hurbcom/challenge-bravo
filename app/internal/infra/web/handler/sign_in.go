package handler

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type SignInHandler struct {
	useCase usecase.SignInUseCase
}

type SignInRequest struct {
	Email    string `json:"email" example:"johndoe@gmail.com"`
	Password string `json:"password" example:"12$a@3$@00!"`
}

func (r SignInRequest) MapToDomain() usecase.SignInUseCaseParamsDto {
	return usecase.SignInUseCaseParamsDto{
		Email:    r.Email,
		Password: r.Password,
	}
}

func (r SignInRequest) Valid() error {
	reqErrors := []string{}
	if r.Email == "" {
		reqErrors = append(reqErrors, "email is required")
	}

	if r.Password == "" {
		reqErrors = append(reqErrors, "password is required")
	}

	if len(reqErrors) > 0 {
		return errors.New(strings.Join(reqErrors, ", "))
	}

	return nil
}

type SignInResponse struct {
	User  SignInUserResponse `json:"user"`
	Token string             `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwiZXhwIjoxNzI3NDkzMTg4LCJpZCI6NSwicm9sZSI6InVzZXIifQ.jpvz7KPxB7dOMSREn1tc8nfJyYgSWVq3GuF71fnBsos"`
}

type SignInUserResponse struct {
	CreatedAt time.Time `json:"created_at" example:"2024-09-26T02:50:34.749998Z"`
	UpdatedAt time.Time `json:"updated_at" example:"2024-09-26T02:50:34.749998Z"`
	Active    *bool     `json:"active" example:"true"`
	FirstName string    `json:"first_name" example:"John"`
	LastName  string    `json:"last_name" example:"Doe"`
	Email     string    `json:"email" example:"johndoe@gmail.com"`
	Role      enum.Role `json:"role" example:"user"`
	ID        int       `json:"id" example:"2"`
}

func (r SignInResponse) MapToResponse(p usecase.SignInUseCaseResponseDto) SignInResponse {
	return SignInResponse{
		User: SignInUserResponse{
			CreatedAt: p.User.CreatedAt,
			UpdatedAt: p.User.UpdatedAt,
			Active:    p.User.Active,
			FirstName: p.User.FirstName,
			LastName:  p.User.LastName,
			Email:     p.User.Email,
			Role:      p.User.Role,
			ID:        p.User.ID,
		},
		Token: p.Token,
	}
}

// SignIn godoc
//
//	@Summary		Sign In
//	@Description	authorization
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			data	body		SignInRequest	true	"sign in data"
//	@Success		200		{object}	SignInResponse
//	@Failure		500		{object}	exception.InternalServerException
//	@Failure		400		{object}	exception.BadRequestException
//	@Router			/auth [post]
func (h SignInHandler) Execute(c *gin.Context) {
	body := SignInRequest{}

	readBody(c, &body)

	err := body.Valid()
	if err != nil {
		panic(exception.BadRequest(err.Error()))
	}

	signIn := h.useCase.Execute(c, body.MapToDomain())

	res := SignInResponse{}

	c.JSON(http.StatusOK, res.MapToResponse(signIn))
}

func NewSignInHandler(useCase usecase.SignInUseCase) SignInHandler {
	return SignInHandler{
		useCase: useCase,
	}
}
