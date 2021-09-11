using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Services.Interfaces;
using CurrencyQuotation.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CurrencyQuotation.Jobs
{
    public class MigrationJob : IHostedService
    {
        private readonly ILogger<MigrationJob> _logger;

        private readonly IServiceScopeFactory _serviceScopeFactory;

        private readonly IRedisCacheService _redisCacheService;

        private QuotationContext Context { get; set; }

        private const int MAX_ATTEMPS = 10;

        private const int DELAY_EXECUTE_MIGRATION = 5000;

        private const string KEY_CACHE_RUNNING = "MigrationRunning";

        private int CountRetriesMigrations { get; set; }

        public MigrationJob(ILogger<MigrationJob> logger, IServiceScopeFactory serviceScopeFactory, IRedisCacheService redisCacheService)
        {
            this.CountRetriesMigrations = 1;
            this._logger = logger;
            this._serviceScopeFactory = serviceScopeFactory;
            this._redisCacheService = redisCacheService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            this._logger.LogInformation("INIT - MigrationJob");

            try
            {
                UtilitiesJob.CheckRunningInAnotherAppContainer(this._redisCacheService, KEY_CACHE_RUNNING);

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    this.Context = scope.ServiceProvider.GetRequiredService<QuotationContext>();

                    ExecuteMigrations();
                }
            }
            catch (AggregateException ex)
            {
                this._logger.LogWarning(ex.Message);
            }

            this._logger.LogInformation("END - MigrationJob");

            return Task.CompletedTask;
        }

        private void ExecuteMigrations()
        {
            try
            {
                Context.Database.Migrate();
                this._logger.LogInformation("Migrations executadas com sucesso!");
            }
            catch (SqlException ex)
            {
                this._logger.LogError($"Erro: {ex.Message}");

                if (this.CountRetriesMigrations <= MAX_ATTEMPS)
                {
                    this._logger.LogError($"Erro ao executar as migrations. Tentativa {this.CountRetriesMigrations} de {MAX_ATTEMPS}");

                    this.CountRetriesMigrations++;
                    Thread.Sleep(DELAY_EXECUTE_MIGRATION);

                    ExecuteMigrations();
                }
                else
                {
                    throw;
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
