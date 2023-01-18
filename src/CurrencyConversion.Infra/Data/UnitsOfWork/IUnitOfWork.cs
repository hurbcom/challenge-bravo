namespace CurrencyConversion.Infra.Data.UnitsOfWork;
internal interface IUnitOfWork
{
    public bool Commit();
}
