using ChallengeBravo.Moedas;
using ChallengeBravo.Servicos;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ChallengeBravo.Tests.Moedas
{
    public class MoedaTeste : ChallengeBravoTestBase
    {
        private readonly MoedaAppService _moedaAppService;
        private readonly ServicoAppService _servicoAppService;

        public MoedaTeste()
        {
            _servicoAppService = LocalIocManager.Resolve<ServicoAppService>();
            _moedaAppService = LocalIocManager.Resolve<MoedaAppService>(_servicoAppService);
        }

        [Fact]
        public void Deve_Inserir_Nova_Moeda()
        {
            //Act
            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste",
                Codigo = "TST",
                ValorUSD = 1000
            });

            //Assert
            UsingDbContext(context =>
            {
                context.Moeda.Count().ShouldBe(1);
                //context.Moeda.FirstOrDefault(t => t.AssignedPersonId == null && t.Description == "my test task 1").ShouldNotBe(null);
                //context.Moeda.FirstOrDefault(t => t.Codigo == "TST").Codigo.ShouldBe("TST");
                //task2.ShouldNotBe(null);

            });

        }

        [Fact]
        public void Deve_Apagar_Moeda_Por_Id()
        {
            //Arrange

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste",
                Codigo = "TST",
                ValorUSD = 1000
            });

            Guid idMoeda = _moedaAppService.ObterIdPorCodigo("TST");

            //Act

            _moedaAppService.ApgarPorId(idMoeda);

            //Assert

            UsingDbContext(context =>
            {
                context.Moeda.FirstOrDefault(t => t.Id == idMoeda).ShouldBeNull();

            });

        }

        [Fact]
        public void Deve_Apagar_Moeda_Por_Codigo()
        {
            //Arrange

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste",
                Codigo = "TST",
                ValorUSD = 1000
            });

            //Act

            _moedaAppService.ApagarPorCodigo("TST");

            //Assert

            UsingDbContext(context =>
            {
                context.Moeda.FirstOrDefault(t => t.Codigo == "TST").ShouldBeNull();

            });

        }

        [Fact]
        public void Deve_Conventer_Duas_Moedas()
        {
            //Arrange

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste 1",
                Codigo = "TST1",
                ValorUSD = 0.1905f
            });

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste 2",
                Codigo = "TST2",
                ValorUSD = 1.1794f
            });

            //Act

            var resultado = _moedaAppService.ConverterMoedas("TST1", "TST2", 10);

            //Assert

            resultado.ToString().ShouldBe("1,62");

        }

        [Fact]
        public void Deve_Tentar_Conventer_Duas_Moedas_Com_Codigo_Invalido()
        {
            //Arrange

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste 1",
                Codigo = "TST1",
                ValorUSD = 0.1905f
            });

            _moedaAppService.Inserir(new MoedaInputDto
            {
                Nome = "Moeda Teste 2",
                Codigo = "TST2",
                ValorUSD = 1.1794f
            });

            //Act

            //Primeiro código inexistente
            var resultado1 = Record.Exception(() => _moedaAppService.ConverterMoedas("TST1_erro", "TST2", 10));

            //Segundo código inexistente
            var resultado2 = Record.Exception(() => _moedaAppService.ConverterMoedas("TST1", "TST2_erro", 10));

            //Ambos códigos inexistentes
            var resultado3 = Record.Exception(() => _moedaAppService.ConverterMoedas("TST1f_erro", "TST2_erro", 10));

            //Assert

            resultado1.Message.ShouldNotBeNull();
            resultado2.Message.ShouldNotBeNull();
            resultado3.Message.ShouldNotBeNull();

        }

    }
}
