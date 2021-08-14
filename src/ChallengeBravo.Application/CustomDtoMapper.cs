using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.EntityHistory;
using Abp.Localization;
using Abp.Notifications;
using Abp.Organizations;
using Abp.UI.Inputs;
using AutoMapper;
using ChallengeBravo.Moedas;

namespace ChallengeBravo
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
           
            /* Aqui serão adicionados os mapeamentos de DTO */

            //Moeda
            configuration.CreateMap<MoedaInputDto, Moeda>();

        }
    }
}
