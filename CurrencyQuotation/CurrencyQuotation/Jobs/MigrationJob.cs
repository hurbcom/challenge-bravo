using CurrencyQuotation.DatabaseContext;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace CurrencyQuotation.Jobs
{
    public class MigrationJob : IHostedService
    {
        private readonly ILogger<MigrationJob> _logger;

        private readonly IServiceScopeFactory _serviceScopeFactory;

        private QuotationContext Context { get; set; }

        private const int MAX_ATTEMPS = 10;

        private const int DELAY_EXECUTE_MIGRATION = 5000;

        private int CountRetriesMigrations { get; set; }

        public MigrationJob(ILogger<MigrationJob> logger, IServiceScopeFactory serviceScopeFactory)
        {
            this.CountRetriesMigrations = 1;
            this._logger = logger;
            this._serviceScopeFactory = serviceScopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                this.Context = scope.ServiceProvider.GetRequiredService<QuotationContext>();

                ExecuteMigrations();
            }

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
