using challenge_bravo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace challenge_bravo.Repository
{
    public interface ICurrencyRepository
    {
        IEnumerable<Currency> GetAllCurrency();
        Currency GetCurrencyByBase(string cur);
        void PostCurrency(Currency currency);
        void PutCurrency(Currency currency);
        void DeleteCurrency(Currency currency);
        Convertion ConvertCurrency(Currency coinToConvert, Currency coinFromConvert, decimal amount);
        void SaveChanges();
    }
}
