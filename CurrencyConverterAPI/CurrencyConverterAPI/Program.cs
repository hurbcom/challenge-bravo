using Microsoft.AspNetCore.Rewrite;
using Microsoft.OpenApi.Models;
using Serilog;

#region Serilog - Pt1
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");
#endregion

try
{
    var builder = WebApplication.CreateBuilder(args);

    #region Serilog - Pt2
    builder.Host.UseSerilog((ctx, lc) => lc
            .WriteTo.Console()
            .ReadFrom.Configuration(ctx.Configuration));
    #endregion

    builder.Services.AddControllers();

    #region Versionamento de API
    builder.Services.AddApiVersioning();
    #endregion

    #region Swagger - pt1
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1",
            new OpenApiInfo
            {
                Title = "Currency Converter API",
                Version = "v1",
                Description = "REST API developed as a requirement for the 'Bravo' technical challenge of 'Hurb'.",
                Contact = new OpenApiContact
                {
                    Name = "Eliz Carvalho",
                    Url = new Uri("https://br.linkedin.com/in/elizcarvalho")
                }
            }); ;
    });
    #endregion

    var app = builder.Build();

    #region Serilog - Pt3 (Registro do middleware de solicitação)
    app.UseSerilogRequestLogging();
    #endregion

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    #region Swagger - pt2
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Currency Converter API");
    });

    var option = new RewriteOptions();
    option.AddRedirect("^$", "swagger");
    app.UseRewriter(option);
    #endregion

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
    throw;
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}