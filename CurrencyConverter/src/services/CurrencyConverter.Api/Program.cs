using CurrencyConverter.Api.AutoMapper;
using CurrencyConverter.Api.Configuration;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApiConfiguration(builder.Configuration);
builder.Services.AddMongoDbConfig(builder.Configuration);
builder.Services.AddSwaggerConfiguration();
builder.Services.RegisterServices();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddRedisClientConfig(builder.Configuration);

builder.Services.AddHealthChecks();


var app = builder.Build();

app.MapHealthChecks("/healthz");

// Configure the HTTP request pipeline.
app.UseSwaggerConfiguration();
app.UseApiConfiguration();


app.Run();
