namespace Cuco.Application.GetCurrencyInUSD;
internal class GetCurrencyInUSDService : IGetCurrencyInUSDService
{
    public async Task<decimal?> GetCurrencyInUSDAsync(string currency)
    {
        currency= currency.ToLower();
        if (currency == "usd") return 1;

        if (IsAvailable(currency))
            return await GetAvailableCurrencyValue();
        else
            return await GetUnavailableCurrencyValue();
    }

    private Task<decimal?> GetUnavailableCurrencyValue()
    {
        throw new NotImplementedException();
    }

    private Task<decimal?> GetAvailableCurrencyValue()
    {
        throw new NotImplementedException();
    }

    private bool IsAvailable(string currency)
    {
        throw new NotImplementedException();
    }
}
