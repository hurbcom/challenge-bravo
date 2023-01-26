using Cuco.Domain.Users.Models.DTO;

namespace Cuco.Application.Adapters;

public interface ITokenAdapter
{
    string GenerateToken(UserDto user);
}