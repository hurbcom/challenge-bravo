using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.Core.Services;
using currency_conversion.infrastructure;
using currency_conversion.infrastructure.Data;
using currency_conversion.infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); ;

//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnectionString ?? ""));

builder.Services.AddTransient<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddTransient<IConvertService, ConvertService>();
builder.Services.AddTransient<ICurrencyFetch, CurrencyFetch>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
