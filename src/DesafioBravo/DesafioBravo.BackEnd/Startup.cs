using DesafioBravoBackEnd.BO;
using DesafioBravoBackEnd.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace DesafioBravoBackEnd
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "DesafioBravo.BackEnd", Version = "v1" });
            });

            services.AddDbContext<AppDbContext>();
            services.AddScoped<IAcessoBO, AcessoBO>();
            services.AddScoped<ICotacaoBO, CotacaoBO>();
            services.AddScoped<IMoedaBO, MoedaBO>();
            services.AddScoped<IMoedaDAO, MoedaDAO>();
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApplication1 v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors(option => option.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


            using (var context = new AppDbContext())
            {
                context.Database.EnsureCreated();
                new MoedaBO(context).DadosIniciais();
            }
        }
    }
}
