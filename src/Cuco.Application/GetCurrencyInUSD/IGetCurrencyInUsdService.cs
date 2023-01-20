namespace Cuco.Application.GetCurrencyInUSD;
public interface IGetCurrencyInUsdService
{
    Task<decimal?> GetCurrencyInUsdAsync(string symbol);
}
