namespace Cuco.Commons.Base;

public interface ILockingService
{
    public Task<bool> GetLockAsync(string key);
    public Task ReleaseLockAsync(string key);
    public Task<bool> IsLockedAsync(string key);
}