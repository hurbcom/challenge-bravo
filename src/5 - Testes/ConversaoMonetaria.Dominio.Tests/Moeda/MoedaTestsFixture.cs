using Bogus;
using Moq.AutoMock;

namespace ConversaoMonetaria.Dominio.Tests.Moeda;

public class MoedaTestsFixture
{
    private const string Locale = "pt_BR";

    public Entidades.Moedas.Moeda GerarMoedaValida()
    {
        var Moeda = new Faker<Entidades.Moedas.Moeda>(Locale)
            .CustomInstantiator(f =>
                new Entidades.Moedas.Moeda{Nome = f.Person.FirstName, Codigo = "ABC", Cotacao = 2});

        return Moeda;
    }

    public Entidades.Moedas.Moeda GerarMoedaInvalida()
    {
        var Moeda = new Faker<Entidades.Moedas.Moeda>(Locale)
            .CustomInstantiator(f =>
                new Entidades.Moedas.Moeda{Nome = "", Codigo = "A", Cotacao = -1});

        return Moeda;
    }
}