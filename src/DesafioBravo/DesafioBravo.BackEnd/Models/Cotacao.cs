namespace DesafioBravoBackEnd.Models
{
    public class Cotacao
    {
        public Moeda moedaOrigem { get; set; }
        public Moeda moedaDestino { get; set; }
        public decimal valorParaConversao { get; set; }
        public decimal valorConvertido { get; set; }
    }
}
