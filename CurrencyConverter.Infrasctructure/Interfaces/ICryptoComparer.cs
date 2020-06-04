namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface ICryptoComparer
    {
        decimal GetLastestRate(string currency);
    }
}
