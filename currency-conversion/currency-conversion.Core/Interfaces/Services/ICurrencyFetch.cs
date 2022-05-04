namespace currency_conversion.Core.Interfaces.Services
{
    public interface ICurrencyFetch
    {
        public void UpdateCurrencies();

        public Task FetchCurrenciesAsync();
    }
}
