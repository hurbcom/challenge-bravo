using Cuco.Application.UserProviders;
using Cuco.Commons;
using Cuco.Commons.Base;
using Cuco.Domain.Roles.Models.Consts;
using Cuco.Domain.Roles.Services.Repositories;
using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Models.Entities;
using Cuco.Domain.Users.Services.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserProvider _userProvider;
    private readonly IUserRepository _userRepository;

    public UserController(IUserProvider userProvider, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userProvider = userProvider;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    [ProducesResponseType(typeof(Result<UserDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult> AddAsync(
        [FromServices] IRoleRepository roleRepository,
        [FromBody] SignUpDTO input)
    {
        try
        {
            var role = await roleRepository.GetAsNoTrackingAsync(input.Role.GetHashCode());
            var user = new User(input.Name, input.Password, role);
            _userRepository.Insert(user);
            if (!_unitOfWork.Commit())
                return StatusCode(StatusCodes.Status500InternalServerError);
            var result = new Result<UserDTO>
            {
                Output = new UserDTO { Name = user.Name, Role = user.Role }
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPut("{name}")]
    [Authorize]
    [ProducesResponseType(typeof(Result<UserDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult> UpdateAsync(
        [FromBody] UpdatedUserDTO input,
        string name)
    {
        try
        {
            if (name != _userProvider.GetUserName())
                return StatusCode(StatusCodes.Status401Unauthorized);

            var user = await _userRepository.GetByNameAsync(name);
            user.SetPassword(input.NewPassword);
            _unitOfWork.Commit();
            var result = new Result<UserDTO>
            {
                Output = new UserDTO { Name = user.Name, Role = user.Role }
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{name}")]
    [Authorize]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteAsync(
        string name)
    {
        try
        {
            var userName = _userProvider.GetUserName();
            if (userName is "ADMIN" or "SYNC" || userName != name)
                return StatusCode(StatusCodes.Status401Unauthorized);

            if (!await _userRepository.DeleteByNameAsync(name) && !_unitOfWork.Commit())
                return StatusCode(StatusCodes.Status500InternalServerError);
            var result = new Result<bool>
            {
                Output = true
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}