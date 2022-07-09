using System.ComponentModel.DataAnnotations;

namespace DesafioBravoBackEnd.ViewModels
{
    public class MoedaViewModel
    {
        [Required]
        public string Codigo { get; set; }
        [Required]
        public decimal ValorEmDolar { get; set; }
    }
}