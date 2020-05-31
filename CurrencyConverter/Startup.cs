using CurrencyConverter.Infrasctructure;
using CurrencyConverter.Infrastructure;
using CurrencyConverter.Service;
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
            logger.LogWarning("Logger configured!");
            loggerFactory.AddConsole();
        }

        public IConfiguration _config { get; }
        public IHostingEnvironment _env { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            DependencyInjection.Register(services);
            services.AddScoped<IBackgroundJobsSrvc, BackgroundJobsSrvc>();

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

            services.AddDistributedRedisCache(opt =>
            {
                opt.Configuration = "127.0.0.1";
            });

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

            databaseContext.EnsureSeedDataForContext();

            app.UseHangfireDashboard();
            backgroundJobs.callUpdateAllCurrencyRates();
            app.UseMvc();
        }
    }
}
