using DesafioBravo.BO;
using DesafioBravo.DTO;
using Xunit;

namespace TestesUnitarios
{
    public class UnitTestMoeda
    {
        private MoedaBO moedaBO;
        private CotacaoBO cotacaoBO;
        private FakeDbContext fakeDbContext;

        public UnitTestMoeda()
        {
            fakeDbContext = new FakeDbContext();
            moedaBO = new MoedaBO(fakeDbContext.context);
            cotacaoBO = new CotacaoBO(fakeDbContext.context);
        }

        [Fact]
        public void AddMoeda()
        {
            MoedaDTO dto = moedaBO.Adicionar("PSN", (decimal)1);

            Assert.True(dto.retorno.sucesso);
        }

        [Fact]
        public void getMoeda()
        {
            MoedaDTO dto = moedaBO.Buscar("BRL");

            Assert.True(dto.retorno.sucesso);
        }

        [Fact]
        public void getMoedas()
        {
            MoedasDTO dto = moedaBO.Buscar();

            Assert.True(dto.retorno.sucesso);
        }

        [Fact]
        public void getMoedaNaoExistente()
        {
            MoedaDTO dto = moedaBO.Buscar("FAKE_MOEDA");

            Assert.False(dto.retorno.sucesso);
        }

        [Fact]
        public void deleteMoeda()
        {
            MoedaDTO dto = moedaBO.Remover("DEL");

            Assert.True(dto.retorno.sucesso);
        }

        [Fact]
        public void deleteMoedaNaoExistente()
        {
            MoedaDTO dto = moedaBO.Remover("FAKE_MOEDA");

            Assert.False(dto.retorno.sucesso);
        }

        [Fact]
        public void GetCotacao()
        {
            CotacaoDTO dto = cotacaoBO.Buscar("USD", "BRL", "200.50");

            Assert.True(dto.retorno.sucesso);
        }
    }
}