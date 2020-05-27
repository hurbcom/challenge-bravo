using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CurrencyConverter.Infrasctructure;
using CurrencyConverter.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

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
            var connectionString = _config.GetConnectionString("localDb");
            services.AddDbContext<DatabaseContext>(db => db.UseMySql(connectionString));

            services.AddMvc(opt =>
            {
                if (!_env.IsDevelopment())
                {
                    opt.Filters.Add(new RequireHttpsAttribute());
                    opt.SslPort = 44388;
                }
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, DatabaseContext databaseContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            databaseContext.EnsureSeedDataForContext();
            app.UseMvc();
        }
    }
}
