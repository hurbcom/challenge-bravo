using System;
using System.Threading;
using System.Threading.Tasks;
using ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;
using ConversaoMonetaria.Dominio.Core.Handle;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ConversaoMonetaria.Api.Worker;

/// <summary>
///  Worker responsavel por atualizar cotações com AwesomeApi e gravar no banco.
/// </summary>
public class CotacoesWorker : BackgroundService
{
    private readonly IAwesomeApiAppService _awesomeApiAppService;
    private readonly ILogger<CotacoesWorker> _logger;

    /// <summary>
    /// Construtor
    /// </summary>
    /// <param name="logger">Objeto para logar eventos no serilog</param>
    /// <param name="awesomeApiAppService"> Service que consome a API de busca de cotações</param>
    public CotacoesWorker(ILogger<CotacoesWorker> logger, IAwesomeApiAppService awesomeApiAppService)
    {
        _logger = logger;
        _awesomeApiAppService = awesomeApiAppService;
    }

    /// <summary>
    ///  Executa quando o worker é iniciado
    /// </summary>
    /// <param name="cancellationToken"> solitacao de cancelamento</param>
    /// <returns></returns>
    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("O servico de atualização de cotações foi iniciado");
        return base.StartAsync(cancellationToken);
    }

    /// <summary>
    /// Executa quando o worker é parado
    /// </summary>
    /// <param name="cancellationToken">solitacao de cancelamento</param>
    /// <returns></returns>
    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("O servico de atualização de cotações foi parado");
        return base.StopAsync(cancellationToken);
    }

    /// <summary>
    ///  Acionado sempre que o worker estiver em execução
    /// </summary>
    /// <param name="stoppingToken"></param>
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
            try
            {
                //Aguarda 10 segundos
                await Task.Delay(10000, stoppingToken);

                var retorno = await _awesomeApiAppService.AtualizarCotacoes();

                if (retorno.EhFalha())
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