using DevOne.Security.Cryptography.BCrypt;

namespace Cuco.Domain.Users.Services.Extensions;

public static class UserExtensions
{
    private const int WorkFactor = 200;

    public static string Hash(this string password)
    {
        return BCryptHelper.HashPassword(password, BCryptHelper.GenerateSalt(WorkFactor));
    }

    public static bool Verify(this string password, string hashedPassword)
    {
        return BCryptHelper.CheckPassword(password, hashedPassword);
    }
}