namespace Cuco.Application.GetCurrencyInUSD;
public interface IGetCurrencyInUSDService
{
    Task<decimal?> GetCurrencyInUSDAsync(string currency);
}
