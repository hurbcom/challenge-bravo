using System;
using Bogus;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Retornos.RetornosPadrao;
using Moq.AutoMock;

namespace ConversaoMonetaria.Aplicacao.Tests.Services.Autenticacao;

public class AutenticacaoAppServiceTestsFixture
{
    private const string Locale = "pt_BR";
    public AutoMocker Mocker;

    public Dominio.Entidades.Autenticacao.Autenticacao GerarAutenticacaoValida()
    {
        var autenticacao = new Faker<Dominio.Entidades.Autenticacao.Autenticacao>(Locale)
            .CustomInstantiator(f =>
                new Dominio.Entidades.Autenticacao.Autenticacao(f.Person.UserName,
                    f.Person.FirstName));

        return autenticacao;
    }

    public AutenticacaoViewModel GerarAutenticacaoRequisicaoViewModelValida()
    {
        return new Faker<AutenticacaoViewModel>(Locale)
            .CustomInstantiator(f => new AutenticacaoViewModel
            {
                Usuario = f.Person.UserName,
                Senha = f.Person.FirstName
            });
    }

    public AutenticacaoViewModel GerarAutenticacaoRequisicaoViewModelInvalida()
    {
        return new AutenticacaoViewModel {Usuario = null, Senha = null};
    }

    public AutenticacaoRespostaViewModel GerarAutenticacaoRespostaViewModelValido()
    {
        return new Faker<AutenticacaoRespostaViewModel>(Locale)
            .CustomInstantiator(f => new AutenticacaoRespostaViewModel
            {
                Resultado =
                    new ResultadoSucessoPadraoViewModel
                    {
                        CodigoMensagem = 100, Mensagem = string.Empty
                    },
                Token = Guid.NewGuid().ToString(),
                DataExpiracao = DateTime.Now.AddHours(5).ToString("dd/MM/yyyy HH:mm")
            });
    }
}