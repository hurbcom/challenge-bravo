using ConversaoMoneraria.AntiCorruption.AwesomeApi;
using ConversaoMoneraria.AntiCorruption.AwesomeApi.Interfaces;
using ConversaoMonetaria.Aplicacao.AppServices;
using ConversaoMonetaria.Aplicacao.AppServices.AntiCorruption;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;
using ConversaoMonetaria.Data.Context;
using ConversaoMonetaria.Data.Repositorio;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SQLitePCL;

namespace ConversaoMonetaria.CrossCutting.IoC;

public class DependencyInjector
{
    public static void RegisterServices(IServiceCollection services)
    {
        AddRepositories(services);
        AddServices(services);
        AddAppServices(services);
    }

    public static void RegisterContext(IServiceCollection services, string connectionString)
    {
        AddContext(services, connectionString);
    }

    private static void AddRepositories(IServiceCollection services)
    {
        services.AddTransient<IMoedaRepositorio, MoedaRepositorio>();
        services.AddTransient<IAutenticacaoRepositorio, AutenticacaoRepositorio>();
    }

    private static void AddServices(IServiceCollection services)
    {
        services.AddTransient<IAwesomeApiService, AwesomeApiService>();
    }

    private static void AddAppServices(IServiceCollection services)
    {
        services.AddTransient<IAutenticacaoAppService, AutenticacaoAppService>();
        services.AddTransient<IAwesomeApiAppService, AwesomeApiAppService>();
        services.AddTransient<IMoedaAppService, MoedaAppService>();
    }

    private static void AddContext(IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ConversaoMonetariaContext>(options => options.UseSqlite(connectionString),
            ServiceLifetime.Singleton);
        raw.SetProvider(new SQLite3Provider_e_sqlite3());
    }
}