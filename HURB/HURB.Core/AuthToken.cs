using HURB.Core.Entities;
using HURB.Core.Model.Request.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HURB.Core
{
    public class AuthToken
    {
        public async Task<AuthenticateResponse> GenerateToken(User user)
        {
            var secretKey = Encoding.ASCII.GetBytes("xsP5LfpLbqfVpHSwVSrSZL5C");
            var tokenHandler = new JwtSecurityTokenHandler();
            var subject = GetClaimIdentity(user);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = subject,
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return await Task.FromResult(new AuthenticateResponse
            {
                Name = user.Name,
                Role = user.Profile.ToString(),
                Token = tokenHandler.WriteToken(token)
            });
        }

        private ClaimsIdentity GetClaimIdentity(User user)
        {
            var claims = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Profile.ToString()),
            });

            return claims;
        }
    }
}
