using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChallengeBravo.EntityFrameworkCore;
using ChallengeBravo.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace ChallengeBravo.Web.Tests
{
    [DependsOn(
        typeof(ChallengeBravoWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class ChallengeBravoWebTestModule : AbpModule
    {
        public ChallengeBravoWebTestModule(ChallengeBravoEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChallengeBravoWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(ChallengeBravoWebMvcModule).Assembly);
        }
    }
}