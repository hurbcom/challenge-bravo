using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ChallengeBravo.Moedas
{
    public class MoedaInputDto : EntityDto
    {
        public string Nome { get; set; }

        public string Codigo { get; set; }

        public double ValorUSD { get; set; }
    }
}
