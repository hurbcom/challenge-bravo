using Cuco.Domain.Users.Models.DTO;

namespace Cuco.Application.Token;

public interface ITokenAdapter
{
    string GenerateToken(UserInfo user);
}