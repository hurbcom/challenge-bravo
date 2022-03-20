using System;
using System.Threading.Tasks;

namespace api_challenge_bravo.Services.Util.ExternalCurrencyAPI
{
    public interface IExternalCurrencyAPI
    {
        Task<Tuple<decimal, DateTime>> GetExchangeRate(string symbol);
        bool CheckAvailabilityOfAutoUpdater(string symbol);
    }
}