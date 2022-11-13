using HURB.Core.Entities.Base;

namespace HURB.Core.Entities
{
    public class Country : Entity
    {
        public string DisplayName { get; set; }
        public string ThreeLetterISORegionName { get; set; }
    }
}