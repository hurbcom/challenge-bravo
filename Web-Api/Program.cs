using DataAccess.Repository;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Web_Api.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var corsPolicy = "CorsPolicy";
var ServerIdHeader = "x-server-id";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy,
        builder =>
        {
            builder.AllowAnyOrigin()
                .WithExposedHeaders(ServerIdHeader);
        });
});

// Inejctions
builder.Services.AddSingleton<IConvertionFactorRepository>(
    provider => new JSONConvertionFactorRepository(builder.Configuration.GetValue<string>("DB_LOCATION"))
);
builder.Services.AddSingleton<ICurrencyConvertionService, CurrencyConvertionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add(ServerIdHeader, (string) builder.Configuration.GetValue<string>("SERVER_ID"));
    await next();
});

app.Run();
