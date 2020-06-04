using CurrencyConverter.API;
using CurrencyConverter.Infrasctructure.ExternalIntegrations;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrasctructure.Repositories;
using CurrencyConverter.Service.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CurrencyConverter
{
    public class DependencyInjection
    {
        public static void Register(IServiceCollection svc)
        {
            //Service
            svc.AddScoped<ICurrencySrvc, CurrencySrvc>();
            svc.AddScoped<IPriceSrvc, PriceSrvc>();
            svc.AddScoped<IDiagnostics, Diagnostics>();
            svc.AddSingleton<IConverterSrvc, ConverterSrvc>();

            //Repository, integration and workers
            svc.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
            svc.AddScoped<ICryptoComparer, CryptoComparer>();
            svc.AddScoped<IBackgroundJobsSrvc, BackgroundJobsSrvc>();
            svc.AddSingleton<ICacheBase, CacheBase>();
        }
    }
}
