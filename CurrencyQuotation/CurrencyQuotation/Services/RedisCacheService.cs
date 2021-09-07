using CurrencyQuotation.Services.Interfaces;
using StackExchange.Redis;
using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CurrencyQuotation.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IConnectionMultiplexer _connectionMultiplexer;

        public RedisCacheService(IConnectionMultiplexer connectionMultiplexer)
        {
            _connectionMultiplexer = connectionMultiplexer;
        }

        public async Task<T> GetRedisCacheForConverter<T>(Func<T> func, string key, TimeSpan expireCache)
        {
            string newKey = InvertKey(key);

            T value = GetRedisCache<T>(func, key, expireCache).Result;

            string valueStr = JsonSerializer.Serialize(value);
            await SetCacheValueAsync(newKey, valueStr, expireCache);

            return value;
        }

        private string InvertKey(string key)
        {
            string[] keys = key.Split("_");
            string first = keys[0];
            string Second = keys[1];

            return string.Concat(Second, "_", first);
        }

        public async Task<T> GetRedisCache<T>(Func<T> func, string key, TimeSpan expireCache)
        {
            RedisValue redisValue = await GetCacheValueAsync(key);

            T dto;

            if (redisValue.HasValue)
            {
                string json = redisValue.ToString();
                dto = JsonSerializer.Deserialize<T>(json);
            }
            else
            {
                dto = func();

                string value = JsonSerializer.Serialize(dto);
                await SetCacheValueAsync(key, value, expireCache);
            }

            return dto;
        }

        private async Task<RedisValue> GetCacheValueAsync(string key)
        {
            var db = _connectionMultiplexer.GetDatabase();
            return await db.StringGetAsync(key);
        }

        private async Task SetCacheValueAsync(string key, string value, TimeSpan expireCache)
        {
            var db = _connectionMultiplexer.GetDatabase();
            await db.StringSetAsync(key, value, expireCache);
        }

        public static string CreateKeyCacheByParams(params object[] parameters)
        {
            StringBuilder stringBuilder = new();
            for (int i = 0; i < parameters.Length; i++)
            {
                if (i == 0)
                {
                    stringBuilder.Append(parameters[i]);
                    continue;
                }
                stringBuilder.Append("_" + parameters[i]);
            }

            return stringBuilder.ToString();
        }
    }
}
