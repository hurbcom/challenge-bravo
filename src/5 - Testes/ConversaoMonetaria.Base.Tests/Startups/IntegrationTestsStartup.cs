using ConversaoMonetaria.Api;
using ConversaoMonetaria.Aplicacao.Automapper;
using ConversaoMonetaria.CrossCutting.IoC;
using ConversaoMonetaria.Data.Context;
using ConversaoMonetaria.Dominio.Autenticacao;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SQLitePCL;

namespace ConversaoMonetaria.Base.Tests.Startups;

public class IntegrationTestsStartup : Startup
{
    public IntegrationTestsStartup(IConfiguration configuration) : base(configuration)
    {
    }

    public override void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton(new ExpiracaoAutenticacao());

        services.AddDbContext<ConversaoMonetariaContext>(options =>
            options.UseSqlite("Data Source=ConversaoMonetariaDB.db;"));
        raw.SetProvider(new SQLite3Provider_e_sqlite3());

        services.AddMvc();
        services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        services.AddAutoMapper(typeof(DomainToViewModelMappingProfile), typeof(ViewModelToDomainMappingProfile));
        DependencyInjector.RegisterServices(services);
    }
}