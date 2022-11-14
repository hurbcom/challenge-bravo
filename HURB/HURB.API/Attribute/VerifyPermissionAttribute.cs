using HURB.Core.Entities;

namespace HURB.API.Attribute
{
    public class VerifyPermissionAttribute : System.Attribute
    {
        public Profile Profile { get; }

        public VerifyPermissionAttribute(Profile profile)
            => Profile = profile;
    }
}
