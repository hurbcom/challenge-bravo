using ConversaoMonetaria.Aplicacao.AppServices;
using ConversaoMonetaria.Aplicacao.Interfaces;
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

    private static void AddAppServices(IServiceCollection services)
    {
        services.AddTransient<IAutenticacaoAppService, AutenticacaoAppService>();
        services.AddTransient<IMoedaAppService, MoedaAppService>();
    }

    private static void AddContext(IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ConversaoMonetariaContext>(options => options.UseSqlite(connectionString));
        raw.SetProvider(new SQLite3Provider_e_sqlite3());
    }
}