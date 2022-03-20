using api_challenge_bravo.Services.Util.ExternalCurrencyAPI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace api_challenge_bravo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Registry the externalAPI for production
            ExternalCurrencyAPI.Registry(new AwesomeAPI());
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}