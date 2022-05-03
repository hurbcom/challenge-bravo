namespace currency_conversion.Core.Interfaces.Services
{
    public interface IConvertService
    {
        public double Convert(string from, string to, double amount);
    }
}
