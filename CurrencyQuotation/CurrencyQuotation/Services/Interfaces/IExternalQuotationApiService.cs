using CurrencyQuotation.Models.Dtos;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface IExternalQuotationApiService
    {
        ExternalApiDto GetCurrenciesQuotationsInDolar();
    }
}
