using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Cuco.Commons.Settings;
using Cuco.Domain.Users.Models.DTO;
using Microsoft.IdentityModel.Tokens;

namespace Cuco.Application.Token;

public class TokenAdapter : ITokenAdapter
{
    private readonly SecuritySettings _securitySettings;

    public TokenAdapter(SecuritySettings securitySettings)
    {
        _securitySettings = securitySettings;
    }

    public string GenerateToken(UserInfo user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_securitySettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.Role, user.Role.Name)
            }),
            Expires = DateTime.UtcNow.AddHours(_securitySettings.ExpirationInHours),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}