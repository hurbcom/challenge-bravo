using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace ConversaoMonetaria.Base.Tests.Resolvers;

public class DependencyResolverHelper
{
    private readonly IWebHost _webHost;

    public DependencyResolverHelper(IWebHost webHost)
    {
        _webHost = webHost;
    }

    public T GetService<T>()
    {
        var serviceScope = _webHost.Services.CreateScope();
        var services = serviceScope.ServiceProvider;
        try
        {
            var scopedService = services.GetRequiredService<T>();
            return scopedService;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw new Exception();
        }
    }
}