using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Infra.Data.Extensions;

public static class SetupPipelineExtensions
{
    public static IApplicationBuilder SetupDataPipeline(this IApplicationBuilder app)
    {
        using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            using var context = serviceScope.ServiceProvider.GetService<CucoDbContext>();
            context.Database.Migrate();
        }

        return app;
    }
}