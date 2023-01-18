namespace CurrencyConversion.Application.ListCurrencies;
public interface IListCurrenciesService
{
    Task<IList<string>> ListCurrencies();
}
