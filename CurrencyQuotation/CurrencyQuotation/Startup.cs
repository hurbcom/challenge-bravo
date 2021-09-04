using CurrencyQuotation.Daos;
using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Services;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Threading;

namespace CurrencyQuotation
{
    public class Startup
    {
        private const int MAX_ATTEMPS = 10;

        private const int DELAY_EXECUTE_MIGRATION = 5000;

        private int CountRetriesMigrations { get; set; }

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;

            this.CountRetriesMigrations = 1;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CurrencyQuotation", Version = "v1" });
            });

            services.AddDbContext<QuotationContext>(options => options.UseSqlServer(Configuration.GetConnectionString("default")));
            services.AddHttpClient();

            services.AddScoped<ICurrencyQuotationService, CurrencyQuotationService>();
            services.AddScoped<IExternalQuotationApiService, ExternalQuotationApiService>();

            services.AddScoped<ICurrencyQuotationDao, CurrencyQuotationDao>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, QuotationContext context, ILogger<Startup> logger)
        {
            ExecuteMigrations(context, logger);

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

        private void ExecuteMigrations(QuotationContext context, ILogger<Startup> logger)
        {
            try
            {
                context.Database.Migrate();
                logger.LogInformation("Migrations executadas com sucesso!");
            }
            catch (SqlException ex)
            {
                logger.LogError($"Erro: {ex.Message}");

                if (this.CountRetriesMigrations <= MAX_ATTEMPS)
                {
                    logger.LogError($"Erro ao executar as migrations. Tentativa {this.CountRetriesMigrations} de {MAX_ATTEMPS}");

                    this.CountRetriesMigrations++;
                    Thread.Sleep(DELAY_EXECUTE_MIGRATION);

                    ExecuteMigrations(context, logger);
                }
                else
                {
                    throw;
                }
            }
        }
    }
}
