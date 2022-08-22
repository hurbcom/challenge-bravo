using Benchmark;
using BenchmarkDotNet.Configs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
using File = System.IO.File;

namespace Test.Benchmark
{
    public class BenchmarkTests
    {
        [Fact]
        public async void LoadDropTest()
        {
            HttpClient _http = new HttpClient();
            var _config = _createConfig(50);
            var loads = _createLoads(_config);

            for (int i = 0; i < loads.Length; i++)
            {
                string query = String.Format("from={0}&to={1}&amount={2}", "USD", "BRL", Random.Shared.NextDouble().ToString().Replace(',', '.'));
                string _url = String.Format("{0}{1}?{2}", _config.WebApi.Url, _config.WebApi.Path, query);
                Console.WriteLine(_url);

                loads[i] = _http.GetStringAsync(_url);
            }
            var results = await Task.WhenAll(loads);

            foreach (var res in results)
            {
                Console.WriteLine(res);

            }
        }

        [Fact]
        public void LoadDropThreadPoolTest()
        {
            HttpClient _http = new HttpClient();
            Config _config = _createConfig(10);
            var loads = _createLoads(_config);
            for (int i = 0; i < loads.Length; i++)
            {
                ThreadPool.QueueUserWorkItem(new WaitCallback((object obj) =>
                {
                    Thread thread = Thread.CurrentThread;
                    string message = $"Background: {thread.IsBackground}, Thread Pool: {thread.IsThreadPoolThread}, Thread ID: {thread.ManagedThreadId}";
                    Console.WriteLine(message);

                    string query = String.Format("from={0}&to={1}&amount={2}", "USD", "BRL", Random.Shared.NextDouble().ToString().Replace(',', '.'));
                    string _url = String.Format("{0}{1}?{2}", _config.WebApi.Url, _config.WebApi.Path, query);
                    Console.WriteLine(_url);

                    //loads[i] = _http.GetStringAsync(_url);
                }));
            }
            Console.Read();
        }

        private Config? _createConfig(int numRequests)
        {
            var c = Config.AddConfigFromText(
            @"
                {
                    ""web-api"": {
                        ""url"": ""http://localhost:5100"",
                        ""path"": ""/currency/convert""
                    },
                    ""load"": {
                        ""requests"": 10
                    }
                }
            ");
            c.Load.Requests = numRequests;
            return c;
        }


        private Task<string>[] _createLoads(Config config)
        {
            return  new Task<string>[config.Load.Requests];
        }
    }
}
