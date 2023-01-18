using Microsoft.AspNetCore.Builder;
using Sislog.Infra.Data.Extensions;

namespace CurrencyConversion.IoC.Extensions;
public static class SetupPipelineExtension
{
    public static IApplicationBuilder SetupPipelineZerezesApi(this IApplicationBuilder app)
    {
        app.SetupDataPipeline();
        return app;
    }
}
