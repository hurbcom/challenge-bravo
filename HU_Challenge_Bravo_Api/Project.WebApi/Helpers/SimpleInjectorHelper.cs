using Project.Business.Facades.Concrete;
using Project.Business.Facades.Interface;
using SimpleInjector;
using SimpleInjector.Integration.WebApi;
using System.Web.Http;

namespace Project.WebApi.Helpers
{
    public static class SimpleInjectorHelper
    {
        public static Container RegisterInjector()
        {
            var container = new Container();

            container.Register<ICurrencyConversionFacade, CurrencyConversionFacade>(Lifestyle.Singleton);

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);

            container.Verify();

            GlobalConfiguration.Configuration.DependencyResolver = new SimpleInjectorWebApiDependencyResolver(container);

            return container;
        }
    }
}