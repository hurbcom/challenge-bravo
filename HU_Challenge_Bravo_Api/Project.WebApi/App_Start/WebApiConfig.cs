using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Project.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{currencySymbol}",
                defaults: new { currencySymbol = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "CurrencyConversionApi",
                routeTemplate: "api/{controller}/{from}/{to}/{amount}",
                defaults: new {
                    from = RouteParameter.Optional,
                    to = RouteParameter.Optional,
                    amount = RouteParameter.Optional
                }
            );
        }
    }
}
