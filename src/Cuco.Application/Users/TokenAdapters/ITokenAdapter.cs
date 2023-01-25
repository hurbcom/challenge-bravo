using Cuco.Domain.Users.Models.DTO;

namespace Cuco.Application.Users.TokenAdapters;

public interface ITokenAdapter
{
    string GenerateToken(UserDto user);
}