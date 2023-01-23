using Cuco.Application.Token;
using Cuco.Domain.Users.Models.Entities;
using Cuco.Domain.Users.Services.Extensions;
using Cuco.Domain.Users.Services.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[Route("auth")]
public class AuthenticationController : ControllerBase
{
    private readonly ITokenAdapter _tokenAdapter;
    private readonly IUserRepository _userRepository;

    public AuthenticationController(IUserRepository userRepository, ITokenAdapter tokenAdapter)
    {
        _userRepository = userRepository;
        _tokenAdapter = tokenAdapter;
    }

    [HttpPost("Authenticate")]
    public async Task<ActionResult<string>> Authenticate([FromBody] User model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userRepository.GetUserInfo(model.Name, model.Password.Hash());

        if (user is null)
            return NotFound(new { message = "Invalid username or password" });

        var token = _tokenAdapter.GenerateToken(user);

        return Ok(token);
    }
}