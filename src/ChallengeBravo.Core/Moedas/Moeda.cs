using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ChallengeBravo.Moedas
{
    public class Moeda : FullAuditedEntity<Guid>
    {
        public virtual string Nome { get; set; }
        public virtual string Codigo { get; set; }

        public virtual double ValorUSD { get; set; }
        
    }
}
