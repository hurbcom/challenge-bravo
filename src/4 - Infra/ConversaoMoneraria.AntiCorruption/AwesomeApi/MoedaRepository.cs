using ConversaoMoneraria.AntiCorruption.AwesomeApi.Interfaces;
using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.DTO.AntiCorruption.AwesomeApi;
using ConversaoMonetaria.Dominio.Exceptions.Base;

namespace ConversaoMoneraria.AntiCorruption.AwesomeApi;

public class AwesomeApiService : IAwesomeApiService, IDisposable
{
    private readonly HttpClient client;

    public AwesomeApiService()
    {
        client = new HttpClient();
    }

    public async Task<Retorno<BussinessException, AwesomeCotacoes>> BuscarCotacoes()
    {
        var resposta = await client.GetAsync($"{ConstantesString.UrlAwesomeApi}/all");

        if (resposta.IsSuccessStatusCode)
        {
            var dadosReposta = await resposta.Content.ReadAsStringAsync();

            return new AwesomeCotacoes(AwesomeRetorno.FromJson(dadosReposta));
        }

        return new ErroServidorException(Convert.ToInt32(resposta.StatusCode), resposta.ReasonPhrase);
    }

    public void Dispose()
    {
        client.Dispose();
    }
}