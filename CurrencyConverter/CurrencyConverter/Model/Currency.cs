namespace CurrencyConverter.Model
{
    public class Currency
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double ValueComparedToDollar { get; set; }

        public Currency()
        {
            //Empty Constructor
        }

        public Currency(long id, string name, double valueComparedToDollar)
        {
            this.Id = id;
            this.Name = name;
            this.ValueComparedToDollar = valueComparedToDollar;
        }
    }
}
