using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace challenge_bravo.Models
{
    public class Currency
    {
        [Key]
        public int Id { get; set; }
        public string Base { get; set; }
        public decimal Value { get; set; }
    }
}