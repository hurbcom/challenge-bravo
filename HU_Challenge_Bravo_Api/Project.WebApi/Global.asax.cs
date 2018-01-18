using Project.WebApi.Helpers;
using System;
using System.Net;
using System.Web.Http;

namespace Project.WebApi
{
    /// <summary>
    /// adadadad
    /// </summary>
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// asdadasd
        /// </summary>
        protected void Application_Start()
        {
            AutoMepperHelper.RegisterMappings();
            SimpleInjectorHelper.RegisterInjector();
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var servicePoint = ServicePointManager.FindServicePoint(new Uri("https://api.coinmarketcap.com/"));
            servicePoint.ConnectionLeaseTimeout = 60 * 1000; // 1 minute
        }
    }
}
