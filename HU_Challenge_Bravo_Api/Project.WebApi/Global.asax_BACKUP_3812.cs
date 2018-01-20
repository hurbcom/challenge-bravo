using Project.WebApi.Helpers;
using System;
using System.Net;
using System.Web;
using System.Web.Http;

namespace Project.WebApi
{
    /// <summary>
<<<<<<< HEAD
    /// This class is used to setup general configurations to the application.
=======
    /// This class is responsible to register global configuration for the appliction
>>>>>>> feature/api_client
    /// </summary>
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
<<<<<<< HEAD
        /// This method will be executed during the application startup, implementing some configurations to the app.
=======
        /// This method execute some actions when the app is building up
>>>>>>> feature/api_client
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
<<<<<<< HEAD
        /// This method is used to setup HTTP request types available to the users.
=======
        /// This method make the API accept GET requests from other networks
>>>>>>> feature/api_client
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
<<<<<<< HEAD

            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET");

                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");

=======
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
>>>>>>> feature/api_client
                HttpContext.Current.Response.End();
            }
        }
    }
}
