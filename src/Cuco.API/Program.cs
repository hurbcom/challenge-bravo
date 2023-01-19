using Cuco.Infra.Data;
using Cuco.IoC.Extensions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.SetupServicesCucoApi(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddMvc()
                .AddControllersAsServices();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cuco.Api",
        Version = "v1"
    });
});

builder.Services.AddHttpClient();

// Build Application
var app = builder.Build();

// Set up application
app.SetupPipelineCucoApi();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Sislog.Api v1");
});

app.UseRouting();

app.MapControllers();

app.Run();