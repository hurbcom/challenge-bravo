using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using DataAccess.Repository;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.DataAccess
{
    public class ConvertionFactorRepositoryTest
    {
        [Fact]
        public void Serializable_Implementation()
        {
            var repo = new JSONConvertionFactorRepository(@"C:\Projetos\challenge-bravo\DB\db.json");
            var u = repo.Find();
            repo.Save(SerializableConvertionFactor.toSerializable(new ConvertionFactor(new BaseCurrency { Coin = "ADA" }, new BaseCurrency { Coin = "BTC" }, 1003)));
        }
    }
}
