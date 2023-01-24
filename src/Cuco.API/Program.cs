using System.Text;
using Cuco.API.Extensions;
using Cuco.IoC.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.SetupServicesCucoApi(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddMvc().AddControllersAsServices();

if (builder.Environment.IsDevelopment())
    builder.Services.SetupSwaggerServices(builder.Configuration);

builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization(options => { });

var secret = builder.Configuration.GetSection("Security:Secret").Value ?? string.Empty;
var key = Encoding.ASCII.GetBytes(secret);
builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.SetupPipelineCucoApi();

if (app.Environment.IsDevelopment())
    app.SetupSwaggerApp();

app.UseRouting();

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.Run();