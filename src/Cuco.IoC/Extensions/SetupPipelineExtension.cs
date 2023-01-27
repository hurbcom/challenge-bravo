using Cuco.Infra.Data.Extensions;
using Microsoft.AspNetCore.Builder;

namespace Cuco.IoC.Extensions;

public static class SetupPipelineExtension
{
    public static IApplicationBuilder SetupPipelineCucoApi(this IApplicationBuilder app)
    {
        app.SetupDataPipeline()
            .SetupAuthApp();
        return app;
    }
}