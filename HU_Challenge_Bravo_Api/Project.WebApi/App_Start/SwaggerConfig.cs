using System.Web.Http;
using WebActivatorEx;
using Project.WebApi;
using Swashbuckle.Application;

namespace Project.WebApi
{
    /// <summary>
    /// Class responsible for swagger configuration.
    /// </summary>
    public class SwaggerConfig
    {
        /// <summary>
        /// This method is used to register the XML that will deliver all the API documentation 
        /// and also define the project in the solution that will keep the API documentation.
        /// </summary>
        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                    {
                        // Use "SingleApiVersion" to describe a single version API. Swagger 2.0 includes an "Info" object to
                        // hold additional metadata for an API. Version and title are required but you can also provide
                        // additional fields by chaining methods off SingleApiVersion.
                        //
                        c.SingleApiVersion("v1", "Project.WebApi");

                        // If you annotate Controllers and API Types with
                        // Xml comments (http://msdn.microsoft.com/en-us/library/b2s063f7(v=vs.110).aspx), you can incorporate
                        // those comments into the generated docs and UI. You can enable this by providing the path to one or
                        // more Xml comment files.
                        //
                        c.IncludeXmlComments(GetXmlCommentsPath());
                    })
                .EnableSwaggerUi(c => { });
        }

        /// <summary>
        /// This method is responsible to get the XML file that will bring all API documentation.
        /// </summary>
        /// <returns></returns>
        protected static string GetXmlCommentsPath()
        {
            return System.String.Format(@"{0}\bin\Project.WebApi.xml", System.AppDomain.CurrentDomain.BaseDirectory);
        }
    }
}
