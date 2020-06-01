using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Threading;

namespace CurrencyConverter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            int processorCounter = Environment.ProcessorCount;
            bool set = ThreadPool.SetMaxThreads(processorCounter, processorCounter);

            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
