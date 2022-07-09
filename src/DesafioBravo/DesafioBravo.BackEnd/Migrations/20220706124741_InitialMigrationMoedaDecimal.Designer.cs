﻿// <auto-generated />
using System;
using DesafioBravoBackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DesafioBravoBackEnd.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20220706124741_InitialMigrationMoedaDecimal")]
    partial class InitialMigrationMoedaDecimal
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.17");

            modelBuilder.Entity("DesafioBravo.Models.Moeda", b =>
                {
                    b.Property<string>("Codigo")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Data")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("ValorEmDolar")
                        .HasColumnType("TEXT");

                    b.HasKey("Codigo");

                    b.ToTable("Moedas");
                });
#pragma warning restore 612, 618
        }
    }
}
