using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrasctructure.Repositories;
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

            //Repository
            svc.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
        }
    }
}
