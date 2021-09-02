using Microsoft.EntityFrameworkCore;

namespace CurrencyQuotation.DatabaseContext
{
    public class QuotationContext : DbContext
    {
        public QuotationContext(DbContextOptions<QuotationContext> options) : base(options)
        {
        }
    }
}
