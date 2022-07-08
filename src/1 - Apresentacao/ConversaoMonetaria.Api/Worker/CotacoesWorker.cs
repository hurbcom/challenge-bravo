using System;
using System.Threading;
using System.Threading.Tasks;
using ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;
using ConversaoMonetaria.Dominio.Core.Handle;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ConversaoMonetaria.Api.Worker;

public class CotacoesWorker : BackgroundService
{
    private readonly IAwesomeApiAppService _awesomeApiAppService;
    private readonly ILogger<CotacoesWorker> _logger;

    public CotacoesWorker(ILogger<CotacoesWorker> logger, IAwesomeApiAppService awesomeApiAppService)
    {
        _logger = logger;
        _awesomeApiAppService = awesomeApiAppService;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("O servico de atualização de cotações foi iniciado");
        return base.StartAsync(cancellationToken);
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("O servico de atualização de cotações foi parado");
        return base.StopAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
            try
            {
                //Aguarda 30 segundos
                await Task.Delay(30000, stoppingToken);

                var retorno = await _awesomeApiAppService.AtualizarCotacoes();

                if (retorno.EhFalha)
                {
                    var falhas = FalhaHandle.Handle(retorno.Failure);
                    falhas.Item2.ForEach(p => _logger.LogInformation("{FalhasItem2} - {Obj}", falhas.Item2, p));
                }
            }
            catch (Exception e)
            {
                _logger.LogInformation(e?.Message);
            }
    }
}