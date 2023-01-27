using Cuco.Application.Contracts.Responses;
using Cuco.Commons.Base;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Extensions;

public static class ErrorResponseExtensions
{
    public static ObjectResult ToObjectResult(this Response response)
    {
        var objectResult = new ObjectResult(new ErrorResponse {
            ErrorMessage = response.Details
        });
        objectResult.StatusCode = response.StatusCode;
        return objectResult;
    }
}