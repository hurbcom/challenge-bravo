using Cuco.API.Extensions;
using Cuco.IoC.Extensions;

const string defaultPolicyName = "DefaultPolicy";

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.SetupServicesCucoApi(builder.Configuration);

    builder.Services.AddControllers();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: defaultPolicyName,
            b =>
            {
                b.AllowAnyOrigin()
                 .AllowAnyHeader()
                 .AllowAnyMethod();
            });
    });

    if (builder.Environment.IsDevelopment())
        builder.Services.SetupSwaggerServices();

    builder.Services.AddHttpClient().AddHttpContextAccessor();
    builder.Services.AddHealthChecks();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
        app.SetupSwaggerApp();

    app.SetupPipelineCucoApi();
    app.UseRouting();
    app.MapControllers();
    app.UseCors(defaultPolicyName);
    app.SetupAuthApp();

    app.MapHealthChecks("/healthz");
    app.Run();
}
catch (Exception)
{
    Console.WriteLine("Unhandled Exception encountered.");
    throw;
}
finally
{
    Console.WriteLine("Shutting API down.");
}