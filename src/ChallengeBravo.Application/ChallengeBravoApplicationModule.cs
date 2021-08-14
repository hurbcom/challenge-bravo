using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChallengeBravo.Authorization;
using System;

namespace ChallengeBravo
{
    [DependsOn(
        typeof(ChallengeBravoCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class ChallengeBravoApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<ChallengeBravoAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            //Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(config =>
            {
                
                config.CreateMap<Moedas.MoedaInputDto, Moedas.Moeda>()
                      .ForMember(u => u.Id, options => options.Ignore());
                

                config.CreateMap<Moedas.MoedaOutputDto, Moedas.Moeda>()
                      .ReverseMap();

                config.CreateMap<Moedas.Moeda, Servicos.ServicoInputDto>()
                      .ForMember(u => u.code, options => options.MapFrom(x => x.Codigo))
                      .ForMember(u => u.bid, options => options.MapFrom(x => x.ValorUSD))
                      .ForMember(u => u.name, options => options.MapFrom(x => x.Nome))
                      .ReverseMap();



            });

        }

        public override void Initialize()
        {
            var thisAssembly = typeof(ChallengeBravoApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);
            /*
            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
            */
        }
    }
}
