using Project.WebApi.Helpers;
using System;
using System.Net;
using System.Web;
using System.Web.Http;

namespace Project.WebApi
{
    /// <summary>
    /// This class is used to setup general configurations to the application.
    /// </summary>
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// This method will be executed during the application startup, implementing some configurations to the app.
        /// </summary>
        protected void Application_Start()
        {
            AutoMepperHelper.RegisterMappings();
            SimpleInjectorHelper.RegisterInjector();
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var servicePoint = ServicePointManager.FindServicePoint(new Uri("https://api.coinmarketcap.com/"));
            servicePoint.ConnectionLeaseTimeout = 60 * 1000; // 1 minute
        }

        /// <summary>
        /// This method is used to setup HTTP request types available to the users.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");

            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET");

                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");

                HttpContext.Current.Response.End();
            }
        }
    }
}
