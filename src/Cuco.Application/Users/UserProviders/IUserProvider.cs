namespace Cuco.Application.UserProviders;

public interface IUserProvider
{
    public string GetUserName();
    public bool UserIsRole(string role);

}