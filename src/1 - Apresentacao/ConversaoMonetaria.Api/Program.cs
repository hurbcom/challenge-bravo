using System.Diagnostics.CodeAnalysis;
using ConversaoMoneraria.AntiCorruption.AwesomeApi;
using ConversaoMoneraria.AntiCorruption.AwesomeApi.Interfaces;
using ConversaoMonetaria.Api.Worker;
using ConversaoMonetaria.Aplicacao.AppServices.AntiCorruption;
using ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;
using ConversaoMonetaria.Data.Context;
using ConversaoMonetaria.Data.Repositorio;
using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;
using ConversaoMonetaria.Dominio.Servicos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace ConversaoMonetaria.Api;

/// <summary>
/// </summary>
[ExcludeFromCodeCoverage]
public class Program
{
    /// <summary>
    /// </summary>
    /// <param name="args"></param>
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    /// <summary>
    /// </summary>
    /// <param name="args"></param>
    /// <returns></returns>
    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        var conversaoMonetariaService = ConversaoMonetariaSingleton.Instance;

        return Host.CreateDefaultBuilder(args)
            .ConfigureServices(services =>
            {
                services.AddHostedService<CotacoesWorker>();
                services.AddTransient<IAwesomeApiAppService, AwesomeApiAppService>();
                services.AddTransient<IAwesomeApiService, AwesomeApiService>();
                services.AddSingleton(conversaoMonetariaService);
                services.AddTransient<IMoedaRepositorio, MoedaRepositorio>();
                services.AddDbContext<ConversaoMonetariaContext>(
                    options => options.UseSqlite(ConstantesString.SQLiteConnection), ServiceLifetime.Singleton);
            }).UseSerilog()
            .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}