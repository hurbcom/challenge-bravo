namespace Cuco.Application.Providers;

public interface IUserProvider
{
    public string GetUserName();
    public bool UserIsRole(string role);
}