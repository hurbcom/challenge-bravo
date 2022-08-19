using Benchmark;
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
            Config? _config = Config.AddConfigFromText(
            @"
                {
                    ""web-api"": {
                        ""url"": ""http://localhost:5126"",
                        ""path"": ""/currency/convert""
                    },
                    ""load"": {
                        ""requests"": 10
                    }
                }
            ");
            HttpClient _http = new HttpClient();

            List<string> responses = new List<string>();
            File.WriteAllText(@"C:\Projetos\challenge-bravo\res.txt", "Results:");

            Task<string>[] loads = new Task<string>[_config.Load.Requests];
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
    }
}
