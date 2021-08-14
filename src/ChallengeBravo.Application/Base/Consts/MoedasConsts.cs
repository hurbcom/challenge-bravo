using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChallengeBravo.Base.Consts
{
    public class MoedasConsts
    {
        //Moedas originais
        public static List<string> listaMoedasOriginais = new List<string> { "USD", "BRL", "EUR", "BTC", "ETH" };

        public static string obterCotacao = "/last/{0}-USD";

        public static string obterTodasAsMoedas = "/json/available/uniq";


    }
}
