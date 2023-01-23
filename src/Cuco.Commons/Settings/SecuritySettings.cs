namespace Cuco.Commons.Settings;

public class SecuritySettings
{
    public string Secret { get; init; }
    public double ExpirationInHours { get; init; }
    public string AdminName { get; init; }
    public string AdminPassword { get; init; }
    public string SyncUserName { get; init; }
    public string SyncUserPassword { get; init; }
}