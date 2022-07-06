namespace DesafioBravo.Dto
{
    public class CambioDTO
    {
        public Moedas rates { get; set; }
    }

    public class Moedas
    {
        public float EUR { get; set; }
        public float BTC { get; set; }
        public float BRL { get; set; }
        public float USD { get; set; }
    }
}