using AutoMapper;
using CurrencyConverter.API.DTO;
using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure;
using CurrencyConverter.Infrastructure;
using Hangfire;
using Hangfire.MySql;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CurrencyConverter
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            _env = env;
            _config = configuration;

            loggerFactory.AddDebug(LogLevel.Debug);
            var logger = loggerFactory.CreateLogger("Startup");
            logger.LogInformation("Logger started");
            loggerFactory.AddConsole();
        }

        public IConfiguration _config { get; }
        public IHostingEnvironment _env { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            DependencyInjection.Register(services);

            var connectionString = _config.GetConnectionString("localDb");
            services.AddDbContext<DatabaseContext>(db => db.UseMySql(connectionString));

            services.AddHangfire(configuration =>
            {
                configuration.UseStorage(
                    new MySqlStorage(
                        connectionString,
                        new MySqlStorageOptions
                        {
                            TablesPrefix = "Hangfire"
                        }
                    )
                );
            });
            services.AddHangfireServer();

            var connectionRedis = _config.GetConnectionString("redis");
            services.AddDistributedRedisCache(opt =>
            {
                opt.Configuration = connectionRedis;
            });

            services.AddAutoMapper(m => m.CreateMap<Currency, CurrencyResponse>());

            services.AddMvc(opt =>
            {
                if (!_env.IsDevelopment())
                {
                    opt.Filters.Add(new RequireHttpsAttribute());
                    opt.SslPort = 44388;
                }
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, DatabaseContext databaseContext, IBackgroundJobsSrvc backgroundJobs)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());

            databaseContext.EnsureSeedDataForContext();

            app.UseHangfireDashboard();
            backgroundJobs.callUpdateAllCurrencyRates();
            app.UseMvc();
        }
    }
}
