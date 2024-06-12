using StackExchange.Redis;

namespace CurrencyConverter.Api.Configuration
{
    public static class RedisClientConfiguration
    {
        public static IServiceCollection AddRedisClientConfig(this IServiceCollection services, IConfiguration configuration)
        {
            var redisClientUrl = configuration.GetSection("RedisCLientUrl").Get<string>();

            services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisClientUrl));
            services.AddHttpClient();

            return services;
        }
    }
}
