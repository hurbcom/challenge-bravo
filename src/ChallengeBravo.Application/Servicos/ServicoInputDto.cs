using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChallengeBravo.Servicos
{
    [JsonObject(MemberSerialization = MemberSerialization.OptIn)]
    public class ServicoInputDto
    {
        [JsonProperty(PropertyName = "code")]
        public string code { get; set; }

        [JsonProperty(PropertyName = "codein")]
        public string codein { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string name { get; set; }

        [JsonProperty(PropertyName = "high")]
        public string high { get; set; }

        [JsonProperty(PropertyName = "low")]
        public string low { get; set; }

        [JsonProperty(PropertyName = "varBid")]
        public string varBid { get; set; }

        [JsonProperty(PropertyName = "pctChange")]
        public string pctChange { get; set; }

        [JsonProperty(PropertyName = "bid")]
        public float bid { get; set; }

        [JsonProperty(PropertyName = "ask")]
        public string ask { get; set; }

        [JsonProperty(PropertyName = "timestamp")]
        public string timestamp { get; set; }

        [JsonProperty(PropertyName = "create_date")]
        public string create_date { get; set; }

    }
}
