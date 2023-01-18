using CurrencyConversion.IoC.Extensions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddHttpContextAccessor();

builder.Services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();

builder.Services.AddControllers();

builder.Services.AddMvc()
                .AddControllersAsServices();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CurrencyConversion.Api",
        Version = "v1"
    });
});

builder.Services.SetupServicesCurrencyConversionApi(builder.Configuration);
builder.Services.AddHttpClient();

// Build Application
var app = builder.Build();

// Set up application
app.SetupPipelineZerezesApi();

var basePath = "/currency_conversion";

app.UsePathBase(new PathString(basePath));

app.Use((context, next) =>
{
    context.Request.PathBase = basePath;
    return next();
});

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Sislog.Api v1");
});

app.UseRouting();

app.MapControllers();

app.Run();