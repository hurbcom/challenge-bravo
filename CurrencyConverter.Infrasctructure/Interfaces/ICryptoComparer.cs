namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface ICryptoComparer
    {
        float GetLastestRate(string currency);
    }
}
