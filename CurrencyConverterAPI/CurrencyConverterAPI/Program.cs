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

    var app = builder.Build();

    #region Serilog - Pt3 (Registro do middleware de solicitação)
    app.UseSerilogRequestLogging();
    #endregion

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

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


