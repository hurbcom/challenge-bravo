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
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CurrencyQuotation", Version = "v1" });
            });

            services.AddDbContext<QuotationContext>(options => options.UseSqlServer(Configuration.GetConnectionString("default")), ServiceLifetime.Singleton);
            services.AddHttpClient();

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
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CurrencyQuotation v1"));
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
