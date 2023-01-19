namespace Cuco.Infra.Data.UnitsOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly CucoDbContext _db;

    public UnitOfWork(CucoDbContext db)
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