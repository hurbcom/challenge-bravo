namespace Cuco.Application.ListCurrencies;
public interface IListCurrenciesService
{
    Task<IList<string>> ListCurrencies();
}
