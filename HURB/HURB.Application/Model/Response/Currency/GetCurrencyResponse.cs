using AutoMapper;

namespace HURB.Application.Model.Response.Currency
{
    public class GetCurrencyResponse
    {
        public Guid Id { get; set; }
        public string ISOCurrencySymbol { get; set; }
        public string? CurrencySymbol { get; set; }

        #region MAP

        public static void Mapping(IMapperConfigurationExpression cfg)
            => cfg.CreateMap<Core.Entities.Currency, GetCurrencyResponse>();

        #endregion MAP
    }
}
