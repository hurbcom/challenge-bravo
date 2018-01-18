using Swashbuckle.Application;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Project.WebApi
{
    /// <summary>
    /// Class where all the API configurations are made, including routes, response formats, the registration of
    /// swagger (lib used to document all the API) and other stuff.
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// This method is responsible to register all the API configurations.
        /// </summary>
        /// <param name="config"></param>
        public static void Register(HttpConfiguration config)
        {
            // Web API routes
            config.MapHttpAttributeRoutes();

            // Defining swagger page as start page for the API
            config.Routes.MapHttpRoute(
                name: "swagger_root",
                routeTemplate: "",
                defaults: null,
                constraints: null,
                handler: new RedirectHandler((message => message.RequestUri.ToString()), "swagger"));

            // Default route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{currencySymbol}",
                defaults: new { currencySymbol = RouteParameter.Optional }
            );

            // Adding customized route
            config.Routes.MapHttpRoute(
                name: "CurrencyConversionApi",
                routeTemplate: "api/{controller}/{from}/{to}/{amount}",
                defaults: new {
                    from = RouteParameter.Optional,
                    to = RouteParameter.Optional,
                    amount = RouteParameter.Optional
                }
            );

            // Adding this code in order to allow the API response be compatible with json format.
            config.Formatters.JsonFormatter.SupportedMediaTypes
                .Add(new MediaTypeHeaderValue("text/html"));

            // Calling swagger into app startup
            SwaggerConfig.Register();
        }
    }
}
