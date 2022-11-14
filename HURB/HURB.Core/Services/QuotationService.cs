using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HURB.Core.Services
{
    public class QuotationService : IQuotationService
    {

        //Não implementado no momento, mas informação será enviada pelo FrontEnd de acordo com o país selecionado.
        private const string USER_COUNTRY = "BRA";
        private const string USER_COUNTRY_CURRENCY = "BRL";

        private readonly IQuotationCurrencyRepository _service;
        private readonly DomainNotification _notification;

        public QuotationService(IQuotationCurrencyRepository service, DomainNotification notification)
        {
            _service = service;
            _notification = notification;
        }

        public async Task<string> GetQuotation(string from, string to, decimal amount)
        {
            var currencyFrom = await _service.GetCurrencyAsync(USER_COUNTRY, from, x => x.Include(x => x.Country).Include(x => x.Currency));
            var currencyTo = await _service.GetCurrencyAsync(USER_COUNTRY, to, x => x.Include(x => x.Country).Include(x => x.Currency));

            if (!IsValidResults(currencyFrom, currencyTo))
                return "";

            string ISOCurrencySymbolFrom = currencyFrom.Currency.ISOCurrencySymbol.ToUpper();
            string ISOCurrencySymbolTo = currencyTo.Currency.ISOCurrencySymbol.ToUpper();

            if (ISOCurrencySymbolFrom == USER_COUNTRY_CURRENCY.ToUpper())
                return (amount / currencyTo.Value).ToString("N8");
            else if (ISOCurrencySymbolTo == USER_COUNTRY_CURRENCY.ToUpper())
                return (amount * currencyFrom.Value).ToString("N8");

            return ((amount * currencyFrom.Value) / currencyTo.Value).ToString("N8");
        }

        #region PRIVATE METHODS

        private bool IsValidResults(QuotationCurrency currencyFrom, QuotationCurrency currencyTo)
        {
            bool isValid = true;

            if (currencyFrom == null)
            {
                _notification.AddNotification("Currency from", "Source currency not found.");
                isValid = false;
            }

            if (currencyTo == null)
            {
                _notification.AddNotification("Currency to", "Target currency not found.");
                isValid = false;
            }

            return isValid;
        }

        #endregion
    }
}
