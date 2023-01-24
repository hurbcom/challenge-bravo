namespace Cuco.Domain.Users.Services.Extensions;

public static class UserExtensions
{
    public static string Hash(this string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool Verify(this string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}