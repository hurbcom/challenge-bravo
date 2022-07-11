using ConversaoMonetaria.Base.Tests.Resolvers;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace ConversaoMonetaria.Base.Tests.Startups;

public class IntegrationTestsFixture
{
    public readonly DependencyResolverHelper ServiceProvider;

    public IntegrationTestsFixture()
    {
        var webHost = WebHost.CreateDefaultBuilder()
            .UseStartup<IntegrationTestsStartup>()
            .Build();

        ServiceProvider = new DependencyResolverHelper(webHost);
    }
}