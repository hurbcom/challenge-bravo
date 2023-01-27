using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Cuco.IoC.Extensions;

public static class SetupAuth
{
    public static IServiceCollection SetupAuthServices(this IServiceCollection service, IConfiguration configuration)
    {
        var secret = configuration.GetSection("JWT:Secret").Value ?? string.Empty;
        var key = Encoding.ASCII.GetBytes(secret);
        service.AddAuthorization()
            .AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        return service;
    }

    public static void SetupAuthApp(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
    }
}