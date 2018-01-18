using Project.Business.Facades.Concrete;
using Project.Business.Facades.Interface;
using SimpleInjector;
using SimpleInjector.Integration.WebApi;
using System.Web.Http;

namespace Project.WebApi.Helpers
{
    /// <summary>
    /// This class is responsible to register the relationship in the dependency injection, between involved items.
    /// </summary>
    public static class SimpleInjectorHelper
    {
        /// <summary>
        /// This method is used to register all the items involed in the dependency injection process.
        /// </summary>
        /// <returns></returns>
        public static Container RegisterInjector()
        {
            var container = new Container();

            container.Register<ICurrencyConversionBusinessFacade, CurrencyConversionBusinessFacade>(Lifestyle.Singleton);

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);

            container.Verify();

            GlobalConfiguration.Configuration.DependencyResolver = new SimpleInjectorWebApiDependencyResolver(container);

            return container;
        }
    }
}