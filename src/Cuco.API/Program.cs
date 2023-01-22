using Cuco.IoC.Extensions;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.SetupServicesCucoApi(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddMvc().AddControllersAsServices();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cuco.Api",
        Version = "v1"
    });
});

builder.Services.AddHttpClient();

var app = builder.Build();

app.SetupPipelineCucoApi();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Cuco.Api v1");
});

app.UseRouting();

app.MapControllers();

app.Run();