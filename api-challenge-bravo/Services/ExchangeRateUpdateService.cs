using System;
using api_challenge_bravo.Model;

namespace api_challenge_bravo.Services
{
    public class ExchangeRateUpdateService
    {
        private const int TIME_TO_LIVE_EXCHANGE_RATE_SECONDS = 30;
        public static void Update(Currency currency)
        {
            // Call API
            // Get ExchangeRate and Time(maybe from header) from request
            currency.UpdateExchangeRate(0.10M, DateTime.Now);
        }

        public static void CheckTTLForNewUpdate(Currency currency)
        {
            if (!currency.AutoUpdateExchangeRate)
                return;
            if (currency.LastTimeUpdatedExchangeRate <= DateTime.Now.AddSeconds(-TIME_TO_LIVE_EXCHANGE_RATE_SECONDS))
                Update(currency);
        }
    }
}