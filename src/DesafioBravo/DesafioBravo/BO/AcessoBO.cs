using Microsoft.Extensions.Configuration;
using System;

namespace DesafioBravo.BO
{
    public class AcessoBO : IAcessoBO
    {
        public bool AcessoValido(string chaveAcesso)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            string chaveacessoAPI = configuration.GetSection("InformacoesAplicacao").GetSection("ChaveAcesso").Value;

            if (chaveAcesso != chaveacessoAPI)
                return false;

            return true;
        }
    }
}
