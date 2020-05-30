using CurrencyConverter.Infrasctructure.ExternalIntegrations;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrasctructure.Repositories;
using CurrencyConverter.Service.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Service
{
    public class DependencyInjection
    {
        public static void Register(IServiceCollection svc)
        {
            //Service
            svc.AddScoped<ICurrencySrvc, CurrencySrvc>();
            svc.AddScoped<IPriceSrvc, PriceSrvc>();

            //Repository, integration and workers
            svc.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
            svc.AddScoped<ICryptoComparer, CryptoComparer>();
        }
    }
}
