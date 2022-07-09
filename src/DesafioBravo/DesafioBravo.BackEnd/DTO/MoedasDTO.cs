using DesafioBravoBackEnd.Models;
using System.Collections.Generic;

namespace DesafioBravoBackEnd.DTO
{
    public class MoedasDTO
    {
        public RetornoDTO retorno { get; set; } = new RetornoDTO();
        public List<Moeda> moedas { get; set; } = new List<Moeda>();
    }
}
