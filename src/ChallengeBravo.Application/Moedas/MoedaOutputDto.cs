using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChallengeBravo.Moedas
{
    public class MoedaOutputDto : EntityDto<Guid>
    {
        public string Nome { get; set; }
        public string Codigo { get; set; }

        public float ValorUSD { get; set; }
    }
}
