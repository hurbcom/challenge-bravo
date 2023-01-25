using System.Text;
using Cuco.API.Extensions;
using Cuco.IoC.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

const string defaultPolicyName = "DefaultPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.SetupServicesCucoApi(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddMvc().AddControllersAsServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: defaultPolicyName,
        b =>
        {
            b
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

if (builder.Environment.IsDevelopment())
    builder.Services.SetupSwaggerServices();

builder.Services.AddHttpClient()
    .AddHttpContextAccessor();

var secret = builder.Configuration.GetSection("JWT:Secret").Value ?? string.Empty;
var key = Encoding.ASCII.GetBytes(secret);
builder.Services.AddAuthorization()
    .AddAuthentication(x =>
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

if (app.Environment.IsDevelopment())
    app.SetupSwaggerApp();

app.SetupPipelineCucoApi();
app.UseRouting();
app.MapControllers();
app.UseCors(defaultPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.Run();