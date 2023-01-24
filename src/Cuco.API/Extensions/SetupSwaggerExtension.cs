using Microsoft.OpenApi.Models;

namespace Cuco.API.Extensions;

public static class SetupSwaggerExtension
{
    public static IServiceCollection SetupSwaggerServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        return services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cuco API", Version = "v1" });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = ParameterLocation.Header,
                Description = "Please insert JWT with Bearer into field"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });
    }

    public static IApplicationBuilder SetupSwaggerApp(this IApplicationBuilder app)
    {
        return app.UseSwagger()
            .UseSwaggerUI(c => { c.SwaggerEndpoint("v1/swagger.json", "Cuco.Api v1"); });
    }
}