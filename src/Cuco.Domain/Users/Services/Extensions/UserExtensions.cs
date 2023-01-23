namespace Cuco.Domain.Users.Services.Extensions;
using BCrypt.Net;
public static class UserExtensions
{
    public static string Hash(this string password)
    {
        return BCrypt.HashPassword(password);
    }

    public static bool Verify(this string password, string hashedPassword)
    {
        return BCrypt.Verify(password, hashedPassword);
    }
}