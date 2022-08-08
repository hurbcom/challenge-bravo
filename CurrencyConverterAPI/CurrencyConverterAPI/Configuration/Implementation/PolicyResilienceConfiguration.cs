using Polly;
using Polly.Contrib.WaitAndRetry;
using Polly.Extensions.Http;

namespace CurrencyConverterAPI.Configuration.Implementation
{
    public static class PolicyResilienceConfiguration
    {
        public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy(int retryCount)
        {
            var delay = Backoff.DecorrelatedJitterBackoffV2(medianFirstRetryDelay: TimeSpan.FromSeconds(1), retryCount);

            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(delay);
        }

        public static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy(int exceptionsAllowedBeforeBreaking, int durationOfBreakInSeconds)
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(exceptionsAllowedBeforeBreaking, TimeSpan.FromSeconds(durationOfBreakInSeconds));
        }
    }
}
