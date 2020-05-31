namespace CurrencyConverter
{
    public interface IBackgroundJobsSrvc
    {
        void callUpdateAllCurrencyRates();
        void callRevalidateCache();
    }
}
