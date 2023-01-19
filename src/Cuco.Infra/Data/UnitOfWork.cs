using Cuco.Commons.Base;

namespace Cuco.Infra.Data;

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
        catch
        {
            return false;
        }
    }
}