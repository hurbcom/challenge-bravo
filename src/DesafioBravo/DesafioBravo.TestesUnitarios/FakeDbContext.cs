using DesafioBravoBackEnd.Data;
using DesafioBravoBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace TestesUnitarios
{

    public class FakeDbContext
    {
        private static DbContextOptions<AppDbContext> dbContextOptions = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "appDbTest").Options;

        public AppDbContext context;

        public FakeDbContext()
        {
            context = new AppDbContext(dbContextOptions);
            context.Database.EnsureCreated();
            MockMoedasFake();
        }

        private void MockMoedasFake()
        {
            if (context.Moedas.AsNoTracking().ToListAsync().Result.Count == 0)
            {
                context.Moedas.AddRange(
                new List<Moeda>
                    {
                         new Moeda {Codigo = "BRL", ValorEmDolar = (decimal)5.33},
                         new Moeda {Codigo = "USD", ValorEmDolar = (decimal)1},
                         new Moeda {Codigo = "BTC", ValorEmDolar = (decimal)0.000049},
                         new Moeda {Codigo = "GTA", ValorEmDolar = (decimal)0},
                         new Moeda {Codigo = "DEL", ValorEmDolar = (decimal)0}
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
