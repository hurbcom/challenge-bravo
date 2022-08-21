using BenchmarkDotNet.Analysers;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Columns;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Exporters;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Loggers;
using BenchmarkDotNet.Exporters.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benchmark.Controllers
{
    [Config(typeof(Config))]
    public class CurrencyConvertionControllerBenchmark
    {
        private class Config : ManualConfig
        {
            public Config()
            {
                AddJob(
                    Job.Dry
                        .WithWarmupCount(0)
                        .WithLaunchCount(1)
                        .WithIterationCount(100)
                );
                AddLogger(ConsoleLogger.Default);
                AddColumn( StatisticColumn.AllStatistics);
                AddExporter(RPlotExporter.Default, JsonExporter.Default);
                AddAnalyser(EnvironmentAnalyser.Default);
                UnionRule = ConfigUnionRule.AlwaysUseLocal;
            }
        }

        private HttpClient _http = new HttpClient();

        private Benchmark.Config _config = Benchmark.Config.AddConfigFrom(@"config.json");

        public CurrencyConvertionControllerBenchmark()
        {
        }

        [Benchmark]
        public async Task LoadDrop()
        {
            Task<string>[] loads = new Task<string>[_config.Load.Requests];
            for (int i = 0; i < loads.Length; i++)
            {
                string query = String.Format("from={0}&to={1}&amount={2}", "USD", "BRL", Random.Shared.NextDouble().ToString().Replace(',', '.'));
                string _url = String.Format("{0}{1}?{2}", _config.WebApi.Url, _config.WebApi.Path, query);

                loads[i] = _http.GetStringAsync(_url);
            }
            var results = await Task.WhenAll(loads);

            //foreach (var res in results)
            //{
            //    Console.WriteLine(res);

            //}
        }
    }
}

