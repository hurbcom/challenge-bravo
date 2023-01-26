using Cuco.Application.Adapters;
using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Services.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Produces("application/json")]
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
    public async Task<ActionResult<TokenDto>> Authenticate([FromBody] SignInDto signIn)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userRepository.GetUserDto(signIn.Name, signIn.Password);

        if (user is null)
            return NotFound(new { message = "Invalid username or password" });

        var token = new TokenDto { Name = signIn.Name, Token = $"Bearer {_tokenAdapter.GenerateToken(user)}" };

        return Ok(token);
    }
}