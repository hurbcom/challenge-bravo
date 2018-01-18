using Swashbuckle.Application;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Project.WebApi
{
    /// <summary>
    /// asdadas
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// dasdadad
        /// </summary>
        /// <param name="config"></param>
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // Defining swagger page as start page for the API
            config.Routes.MapHttpRoute(
                name: "swagger_root",
                routeTemplate: "",
                defaults: null,
                constraints: null,
                handler: new RedirectHandler((message => message.RequestUri.ToString()), "swagger"));

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

            //Calling swagger into app startup
            SwaggerConfig.Register();
        }
    }
}
