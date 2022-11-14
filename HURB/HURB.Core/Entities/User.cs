using HURB.Core.Entities.Base;

namespace HURB.Core.Entities
{
    public class User : Entity
    {
        public string Name { get; set; }
        public Profile Profile { get; private set; }
    }

    public enum Profile
    {
        User = 1,
        Analyst = 2,
        Administrator = 3
    }
}
