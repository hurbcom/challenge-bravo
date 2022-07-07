﻿// <auto-generated />
using System;
using ConversaoMonetaria.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ConversaoMonetaria.Data.Migrations
{
    [DbContext(typeof(ConversaoMonetariaContext))]
    partial class ConversaoMonetariaContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.6");

            modelBuilder.Entity("ConversaoMonetaria.Dominio.Entidades.Moedas.Moeda", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Codigo")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Cotacao")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DataAtualizacao")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DataCadastro")
                        .HasColumnType("TEXT");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Moeda", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            Codigo = "BRL",
                            Cotacao = 5.4125m,
                            DataAtualizacao = new DateTime(2022, 7, 7, 11, 23, 46, 315, DateTimeKind.Local).AddTicks(2759),
                            DataCadastro = new DateTime(2022, 7, 7, 11, 23, 46, 315, DateTimeKind.Local).AddTicks(2772),
                            Nome = "Real Brasileiro",
                            Status = 0
                        },
                        new
                        {
                            Id = 2L,
                            Codigo = "USD",
                            Cotacao = 1m,
                            DataAtualizacao = new DateTime(2022, 7, 7, 11, 23, 46, 315, DateTimeKind.Local).AddTicks(2776),
                            DataCadastro = new DateTime(2022, 7, 7, 11, 23, 46, 315, DateTimeKind.Local).AddTicks(2776),
                            Nome = "Dólar Americano",
                            Status = 0
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
