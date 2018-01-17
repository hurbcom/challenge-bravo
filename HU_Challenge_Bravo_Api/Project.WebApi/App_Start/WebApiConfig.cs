using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
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

            //default route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{currencySymbol}",
                defaults: new { currencySymbol = RouteParameter.Optional }
            );

            //adding customized route
            config.Routes.MapHttpRoute(
                name: "CurrencyConversionApi",
                routeTemplate: "api/{controller}/{from}/{to}/{amount}",
                defaults: new {
                    from = RouteParameter.Optional,
                    to = RouteParameter.Optional,
                    amount = RouteParameter.Optional
                }
            );

            //Adding this code in order to allow the API response be compatible with json format.
            config.Formatters.JsonFormatter.SupportedMediaTypes
                .Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}
