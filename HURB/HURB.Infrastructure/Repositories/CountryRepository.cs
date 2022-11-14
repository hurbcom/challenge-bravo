using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Data;
using HURB.Infrastructure.Repositories.Base;

namespace HURB.Infrastructure.Repositories
{
    public class CountryRepository : BaseRepository<Country>, ICountryRepository
    {
        public CountryRepository(HURBContext context) : base(context)
        {
        }
    }
}
