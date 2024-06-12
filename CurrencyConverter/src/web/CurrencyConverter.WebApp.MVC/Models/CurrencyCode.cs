namespace CurrencyConverter.WebApp.MVC.Models
{
    public class CurrencyCode(string code, string path, string name)
    {
        public string Code { get; } = code;
        public string Path { get; } = path;
        public string Name { get; } = name;
    }
}
