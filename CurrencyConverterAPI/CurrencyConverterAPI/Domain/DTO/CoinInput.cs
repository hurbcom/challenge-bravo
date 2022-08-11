using AutoMapper;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.Domain.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CurrencyConverterAPI.Domain.DTO
{
    public class CoinInput
    {
        [JsonPropertyName("name")]
        [StringLength(64, MinimumLength = 4)]
        public string Name { get; set; }

        [JsonPropertyName("acronym")]
        [StringLength(5, MinimumLength = 3)]
        public string Acronym { get; set; }

        [Range(0.01, 9999999999999.99)]
        [RegularExpression(@"^\d+(\.\d{1,2})?$")]
        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        public string IsValid()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
                return HandlerErrorResponseMessage.BadRequestNameCoinInputRequiredField;

            if (this.Name.Length < 4 || this.Name.Length > 64)
                return HandlerErrorResponseMessage.BadRequestNameCoinInputRangeLenghtField;

            if (string.IsNullOrWhiteSpace(this.Acronym))
                return HandlerErrorResponseMessage.BadRequestAcronymCoinInputRequiredField;

            if (this.Name.Length < 3 || this.Name.Length > 5)
                return HandlerErrorResponseMessage.BadRequestAcronymCoinInputLenghtField;

            if (this.Price <= 0)
                return HandlerErrorResponseMessage.BadRequestPriceCoinInputLenghtField;

            return string.Empty;
        }
    }

    public class CoinInputProfile : Profile
    {
        public CoinInputProfile()
        {
            CreateMap<CoinInput, Coin>();
        }
    }
}
