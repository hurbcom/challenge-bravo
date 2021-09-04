using CurrencyQuotation.Models.Dtos;
using System.Collections.Generic;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface IExternalQuotationApiService
    {
        IList<ExternalApiDto> GetCurrenciesQuotationsInDolar();
    }
}
