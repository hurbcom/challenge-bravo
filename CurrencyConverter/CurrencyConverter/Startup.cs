using CurrencyConverter.DBContexts;
using CurrencyConverter.Repository;
using CurrencyConverter.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter
{
    public class Startup
    {
        private readonly Action<DbContextOptionsBuilder> DbContextAction;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            DbContextAction = o => o.UseSqlServer(Configuration.GetConnectionString("CurrencyConverterDB"));
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpClient();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddDbContext<CurrencyConverterContext>(DbContextAction);
            services.AddTransient<ICurrencyRepository, CurrencyRepository>();
            services.AddTransient<ICurrencyService, CurrencyService>();
            services.AddSingleton<ICurrencyCache, CurrencyCache>();
            services.AddTransient<ICurrencyExternalApi, CurrencyExternalApi>();
            services.AddControllers();

            services.AddSwaggerGen(c =>
            {

                c.SwaggerDoc("v1",
                    new OpenApiInfo
                    {
                        Title = "Comentários",
                        Version = "v1.0",
                        Description = "API para conversão de valores monetários.",
                        Contact = new OpenApiContact
                        {
                            Name = "José Victor Domingues Fernandes",
                            Url = new Uri("https://github.com/JoseVictorDF")
                        }
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ICurrencyService currencyService)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Ativando middlewares para uso do Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Comentários V1.0");
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (!currencyService.GetCurrencies().Any())
            {
                //Na primeira execução, irá incluir as moedas iniciais
                IList<string> currenciesNames = new List<string>() { "USD", "BRL", "EUR", "BTC", "ETH" };
                currencyService.InsertCurrenciesList(currenciesNames);
            }
        }
    }
}
