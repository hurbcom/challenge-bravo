using CurrencyConversion.Infra.Data;
using CurrencyConversion.Infra.Data.UnitsOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly CurrencyConversionDbContext _db;

    public UnitOfWork(CurrencyConversionDbContext db)
    {
        _db = db;
    }

    public bool Commit()
    {
        try
        {
            _db.SaveChanges();
            return true;
        }
        catch (Exception ex)
        {
            var message = ex.Message;
            if (ex.InnerException != null) message += $" - {ex.InnerException.Message}";
            Console.WriteLine($"***ERROR: Error at UnitOfWork.Commit: {message}");

            return false;
        }
    }
}