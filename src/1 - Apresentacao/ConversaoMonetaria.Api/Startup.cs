using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.Json;
using ConversaoMonetaria.Api.App_Data;
using ConversaoMonetaria.Aplicacao.Automapper;
using ConversaoMonetaria.Aplicacao.JwtSecurity;
using ConversaoMonetaria.CrossCutting.IoC;
using ConversaoMonetaria.Dominio.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using SecurityToken = Microsoft.IdentityModel.Tokens.SecurityToken;

namespace ConversaoMonetaria.Api;

/// <summary>
///     Classe de start da aplica��o
/// </summary>
[ExcludeFromCodeCoverage]
public class Startup
{
    /// <summary>
    ///     Construtor
    /// </summary>
    /// <param name="configuration"></param>
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    /// <summary>
    ///     Configuration
    /// </summary>
    public static IConfiguration Configuration { get; set; }

    /// <summary>
    ///     This method gets called by the runtime. Use this method to add services to the container.
    /// </summary>
    /// <param name="services"></param>
    public virtual void ConfigureServices(IServiceCollection services)
    {
        try
        {
            Log.Logger = ObterConfiguracao();
        }
        catch
        {
            // ignored
        }

        var tempoExpiracaoAutenticacaoMinutos =
            Configuration.GetSection("ExpiracaoAutenticacao").Get<ExpiracaoAutenticacao>();

        var ambiente = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        services.AddMvc();

        services.AddControllers();
        services.AddSwaggerGen(c =>
        {
            c.UseAllOfToExtendReferenceSchemas();
            c.SwaggerDoc(SwaggerDoc.Version1,
                new OpenApiInfo
                {
                    Title = $"{SwaggerDoc.Title} ({ambiente})", Version = SwaggerDoc.Version1,
                    Description = SwaggerDoc.Description,
                    Contact = new OpenApiContact
                    {
                        Name = SwaggerDoc.OpenApiContactName,
                        Email = SwaggerDoc.OpenApiContactEmail
                    }
                });

            // Set the comments path for the Swagger JSON and UI.
            var basePath = AppContext.BaseDirectory;
            var lXmlPath = Path.Combine(basePath, "App_Data",
                Assembly.GetExecutingAssembly().GetName().Name + ".xml");
            c.IncludeXmlComments(lXmlPath);

            // To Enable authorization using Swagger (JWT)
            c.AddSecurityDefinition(SwaggerDoc.SecurityDefinitionName, new OpenApiSecurityScheme
            {
                Name = SwaggerDoc.OpenApiSecuritySchemeName,
                Type = SecuritySchemeType.ApiKey,
                Scheme = SwaggerDoc.SecurityDefinitionName,
                BearerFormat = SwaggerDoc.OpenApiSecuritySchemeBearerFormat,
                In = ParameterLocation.Header,
                Description = SwaggerDoc.OpenApiSecuritySchemeDescription
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = SwaggerDoc.SecurityDefinitionName
                        }
                    },
                    new string[] { }
                }
            });
        });

        var key = Encoding.ASCII.GetBytes(Settings.Secret);

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    LifetimeValidator = CustomLifetimeValidator
                };
            });

        services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddSingleton(tempoExpiracaoAutenticacaoMinutos);
        services.AddAutoMapper(typeof(DomainToViewModelMappingProfile), typeof(ViewModelToDomainMappingProfile));

        DependencyInjector.RegisterServices(services);

        // SQLite
        var conectionString = Configuration.GetConnectionString(ConstantesString.SQLiteliasConnection);
        conectionString ??= Configuration.GetConnectionString("DefaultConnection");

        DependencyInjector.RegisterContext(services, conectionString);
    }

    /// <summary>
    ///     This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    /// </summary>
    /// <param name="app"></param>
    /// <param name="env"></param>
    public virtual void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        /*if (env.IsDevelopment())
            app.UseDeveloperExceptionPage();*/

        // Para conseguir ler o corpo da requisi��o no nos Filters deve ser habilitado aqui
        // o armazenamento em buffer antes da invoca��o do MVC
        app.Use((context, next) =>
        {
            context.Request.EnableBuffering();
            return next();
        });

        app.UseStatusCodePages(async context =>
        {
            if (context.HttpContext.Response.StatusCode == 401)
            {
                var resposta = JsonSerializer.Serialize(new
                    {codigoMensagem = 303, mensagem = new NaoAutorizadoException().Message});
                context.HttpContext.Response.ContentType = "application/json";
                await context.HttpContext.Response.WriteAsync(resposta);
            }
        });

        app.UseSwagger();

        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("v1/swagger.json", "ConversaoMonetaria.Api v1");
            c.DefaultModelsExpandDepth(-1);
        });

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }

    /// <summary>
    ///     Tempo de vida do Jwt
    /// </summary>
    /// <param name="notBefore"></param>
    /// <param name="expires"></param>
    /// <param name="tokenToValidate"></param>
    /// <param name="param"></param>
    /// <returns></returns>
    private static bool CustomLifetimeValidator(DateTime? notBefore, DateTime? expires,
        SecurityToken tokenToValidate, TokenValidationParameters param)
    {
        if (expires != null)
            return expires > DateTime.UtcNow;

        return false;
    }

    private static Logger ObterConfiguracao()
    {
        return new LoggerConfiguration()
            .MinimumLevel.Is(Configuration.GetSection("Serilog:MinimumLevel:Default").Get<LogEventLevel>())
            .WriteTo.File(Configuration.GetSection("Serilog:Txt:Path").Value,
                Configuration.GetSection("Serilog:Txt:MinimumLevel").Get<LogEventLevel>(),
                Configuration.GetSection("Serilog:Txt:OutputTemplate").Value)
            .WriteTo.File(Configuration.GetSection("Serilog:Json:Path").Value,
                Configuration.GetSection("Serilog:Json:MinimumLevel").Get<LogEventLevel>())
            .Enrich.FromLogContext()
            .Enrich.With()
            .CreateLogger();
    }
}