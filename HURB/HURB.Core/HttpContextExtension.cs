using HURB.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace HURB.Core
{
    public static class HttpContextExtension
    {
        public static User GetLoggedUser(this HttpContext context)
        {
            try
            {
                return context.Items["AuthenticatedUser"] as User;
            }
            catch
            {
                return null;
            }
        }
    }
}
