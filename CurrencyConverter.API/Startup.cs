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
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IO;
using System.Reflection;

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

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1",
                    new Info
                    {
                        Title = "Currency Converter",
                        Version = "v1",
                        Description = "Documentação da API backend",
                        Contact = new Contact
                        {
                            Name = "Rodrigo Dias de Carvalho",
                            Email = "carvrodrigo@gmail.com"
                        }
                    });

                var appPath = AppContext.BaseDirectory;
                var assemblyName = Assembly.GetEntryAssembly().GetName().Name;
                var fileName = Path.GetFileName(assemblyName + ".xml");
                c.IncludeXmlComments(fileName);
            });

            services.AddMvc(opt =>
            {
                if (!_env.IsDevelopment())
                {
                    //opt.Filters.Add(new RequireHttpsAttribute());
                    //opt.SslPort = 44390;
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
                //app.UseHsts();
                //app.UseHttpsRedirection();
            }

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "swagger";
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Currency Converter backend API");
            });

            databaseContext.EnsureSeedDataForContext();

            app.UseHangfireDashboard();
            backgroundJobs.callUpdateAllCurrencyRates();
            app.UseMvc();
        }
    }
}
