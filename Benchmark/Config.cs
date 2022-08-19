using System.Text.Json;
using System.Text.Json.Serialization;

namespace Benchmark
{
    public class Config
    {

        [JsonPropertyName("web-api")]
        public WebApiConfig WebApi { get; set; }

        public LoadConfig Load { get; set; }

        public static Config? AddConfigFrom(string path)
        {
            return JsonSerializer.Deserialize<Config>(File.ReadAllText(path), new JsonSerializerOptions {PropertyNameCaseInsensitive = true});
        }

        public static Config? AddConfigFromText(string json)
        {
            return JsonSerializer.Deserialize<Config>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }

    public class WebApiConfig
    {
        public string Url { get; set; }
        public string Path { get; set; }
    }

    public class LoadConfig
    {
        public int Requests { get; set; }
    }
}
