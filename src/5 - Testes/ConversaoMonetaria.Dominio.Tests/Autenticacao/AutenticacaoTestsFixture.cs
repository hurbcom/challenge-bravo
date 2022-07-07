using Bogus;
using Moq.AutoMock;

namespace ConversaoMonetaria.Dominio.Tests.Autenticacao;

public class AutenticacaoTestsFixture
{
    private const string Locale = "pt_BR";
    public AutoMocker Mocker;

    public Entidades.Autenticacao.Autenticacao GerarAutenticacaoValida()
    {
        var autenticacao = new Faker<Entidades.Autenticacao.Autenticacao>(Locale)
            .CustomInstantiator(f =>
                new Entidades.Autenticacao.Autenticacao(f.Person.UserName, f.Person.FirstName));

        return autenticacao;
    }

    public Entidades.Autenticacao.Autenticacao GerarAutenticacaoInvalida()
    {
        return new Entidades.Autenticacao.Autenticacao(null, null);
    }
}