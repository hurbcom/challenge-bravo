using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace CurrencyConverterAPI.Domain.Models
{
    public class Coin
    {
        [BsonId]
        [JsonIgnore()]
        public ObjectId InternalId { get; set; }

        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("acronym")]
        public string Acronym { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        public void FillData(string name, string acronym, decimal price)
        {
            this.Name = name.ToUpper();
            this.Acronym = acronym.ToUpper();
            this.Price = price;
        }

        public void NormalizeStrings()
        {
            this.Name = Name.Trim().ToUpper();
            this.Acronym = Acronym.Trim().ToUpper();
        }
    }
}
