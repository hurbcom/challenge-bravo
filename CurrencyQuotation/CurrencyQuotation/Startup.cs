using CurrencyQuotation.Daos;
using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Jobs;
using CurrencyQuotation.Services;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System;
using System.IO;
using System.Reflection;
using System.Threading;

namespace CurrencyQuotation
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ThreadPool.SetMinThreads(200, 200);

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Currency API",
                    Version = "v1",
                    Description = "Uma API para fornecer conversões monetárias de moedas existentes e de moedas que podem ser criadas",
                    Contact = new OpenApiContact
                    {
                        Name = "Vinicius Gonçalves",
                        Email = "vfg2006@gmail.com",
                    },
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            services.AddDbContext<QuotationContext>(options => options.UseSqlServer(Configuration.GetConnectionString("default")), ServiceLifetime.Singleton);
            services.AddHttpClient();

            services.AddSingleton<IConnectionMultiplexer>(con => ConnectionMultiplexer.Connect(Configuration.GetValue<string>("RedisConnection")));
            services.AddSingleton<IRedisCacheService, RedisCacheService>();

            services.AddHostedService<MigrationJob>();
            services.AddHostedService<ExternalQuotationJob>();

            services.AddScoped<ICurrencyQuotationService, CurrencyQuotationService>();
            services.AddScoped<IExternalQuotationApiService, ExternalQuotationApiService>();

            services.AddScoped<ICurrencyQuotationDao, CurrencyQuotationDao>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CurrencyQuotation v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
