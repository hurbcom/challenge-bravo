using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using System;
using System.Threading.Tasks;

namespace CurrencyAPI.Validators
{
    [AttributeUsage(validOn: AttributeTargets.Class | AttributeTargets.Method)]
    public class ApiKey : Attribute, IAsyncActionFilter
    {
        private const string APIKEYNAME = "ApiKey";

        // Validate if the request has the expected key
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            StringValues extractedApiKey = String.Empty;
            if (!context.HttpContext.Request.Query.TryGetValue(APIKEYNAME, out extractedApiKey))
                context.HttpContext.Request.Headers.TryGetValue(APIKEYNAME, out extractedApiKey);

            if (extractedApiKey == StringValues.Empty)
            {
                context.Result = new ContentResult()
                {
                    StatusCode  = 401,
                    Content     = "ApiKey was not Found"
                };
                return;
            }

            IConfiguration appSettings  = context.HttpContext.RequestServices.GetService<IConfiguration>();
            string apiKey               = appSettings.GetValue<string>(APIKEYNAME);

            if (!apiKey.Equals(extractedApiKey))
            {
                context.Result = new ContentResult()
                {
                    StatusCode  = 403,
                    Content     = "Unauthorized Access"
                };
                return;
            }

            await next();
        }
    }
}
