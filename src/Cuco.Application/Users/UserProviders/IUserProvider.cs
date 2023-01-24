namespace Cuco.Application.Users.UserProviders;

public interface IUserProvider
{
    public string GetUserName();
    public bool UserIsRole(string role);
}