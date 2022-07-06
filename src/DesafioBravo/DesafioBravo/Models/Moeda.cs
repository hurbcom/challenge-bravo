using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DesafioBravo.Models
{
    public class Moeda
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Codigo { get; set; }
        public decimal ValorEmDolar { get; set; }
        public DateTime Data { get; set; } = DateTime.Now;
    }
}
