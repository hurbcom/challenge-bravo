using CurrencyConverterAPI.Application.AppServices;
using CurrencyConverterAPI.Application.AppServices.Implementation;
using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.Configuration.Implementation;
using CurrencyConverterAPI.Services;
using CurrencyConverterAPI.Services.Implementation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;
using StackExchange.Redis;
using System.Reflection;

#region Serilog - Pt1
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

Log.Information("Starting up");
#endregion

try
{
    var builder = WebApplication.CreateBuilder(args);

    #region Serilog - Pt2
    builder.Host.UseSerilog((ctx, lc) => lc
            .ReadFrom.Configuration(ctx.Configuration)
            .WriteTo.Console());
    #endregion

    #region CORS - Pt1
    builder.Services.AddCors(options => options.AddDefaultPolicy(b =>
    {
        b.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    }));
    #endregion

    #region ApiConfiguration - ApiBaseUrl
    builder.Services.Configure<ApiConfiguration>(builder.Configuration.GetSection(nameof(ApiConfiguration)));
    builder.Services.AddSingleton<IApiConfiguration>(x => x.GetRequiredService<IOptions<ApiConfiguration>>().Value);
    #endregion

    #region ApiConfiguration - CurrencyBallast
    builder.Services.Configure<ApiConfiguration>(b => b.CurrencyBallast = builder.Configuration["ApiConfiguration:CurrencyBallast"]);
    #endregion

    #region Inputs ResiliencePollicy
    int retryCount = Int16.Parse(builder.Configuration["ResiliencePollicy:retryCount"]);
    int exceptionsAllowedBeforeBreaking = Int16.Parse(builder.Configuration["ResiliencePollicy:exceptionsAllowedBeforeBreaking"]);
    int durationOfBreakInSeconds = Int16.Parse(builder.Configuration["ResiliencePollicy:durationOfBreakInSeconds"]);
    #endregion

    #region HttpClient e ResiliencePollicy
    builder.Services.AddHttpClient<IExchangeService, ExchangeService>(b => b.BaseAddress = new Uri(builder.Configuration["ApiConfiguration:BaseUrl"]))
        .AddPolicyHandler(PolicyResilienceConfiguration.GetRetryPolicy(retryCount))
        .AddPolicyHandler(PolicyResilienceConfiguration.GetCircuitBreakerPolicy(exceptionsAllowedBeforeBreaking, durationOfBreakInSeconds)
    );
    #endregion

    #region Disable Automatic Model State Validation
    builder.Services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);
    #endregion


    #region Redis
    builder.Services.AddSingleton<IConnectionMultiplexer>(options =>
        ConnectionMultiplexer.Connect(new ConfigurationOptions()
        {
            EndPoints = { { builder.Configuration["Redis:Host"], Int16.Parse(builder.Configuration["Redis:Port"]) } },
            ConnectRetry = 2,
            ReconnectRetryPolicy = new LinearRetry(10),
            AbortOnConnectFail = false,
            ConnectTimeout = 5000,
            DefaultDatabase = 0,
            Password = builder.Configuration["Redis:Password"]
        })
    );
    #endregion

    builder.Services.AddControllers();

    #region Injecao de dependencia
    builder.Services.AddScoped<IExchangeAppService, ExchangeAppService>();
    #endregion

    #region Versionamento de API
    builder.Services.AddApiVersioning();
    #endregion

    #region Swagger - pt1
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1",
            new OpenApiInfo
            {
                Title = "Currency Converter API",
                Version = "v1",
                Description = "REST API developed as a requirement for the 'Bravo' technical challenge of 'Hurb'.",
                Contact = new OpenApiContact
                {
                    Name = "Eliz Carvalho",
                    Url = new Uri("https://br.linkedin.com/in/elizcarvalho")
                }
            });
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        options.IncludeXmlComments(xmlPath);
    });
    #endregion

    #region Add HealthCheck
    builder.Services.AddHealthChecks();
    #endregion

    var app = builder.Build();

    #region Route healthcheck
    app.MapHealthChecks("/health");
    #endregion

    #region Serilog - Pt3 (Registro do middleware de solicitação)
    app.UseSerilogRequestLogging();
    #endregion

    app.MapControllers();

    #region CORS - pt2
    app.UseCors();
    #endregion

    #region Swagger - pt2
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Currency Converter API");
        options.RoutePrefix = string.Empty;
    });

    var option = new RewriteOptions();
    option.AddRedirect("^$", "swagger");
    app.UseRewriter(option);
    #endregion

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
    throw;
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}