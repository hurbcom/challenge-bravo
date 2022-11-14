IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'HURB')
BEGIN
    CREATE DATABASE [HURB]
END
GO

USE [HURB]
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Country] (
    [Id] uniqueidentifier NOT NULL,
    [DisplayName] varchar(25) NOT NULL,
    [ThreeLetterISORegionName] varchar(3) NOT NULL,
    CONSTRAINT [PK_Country] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Currency] (
    [Id] uniqueidentifier NOT NULL,
    [ISOCurrencySymbol] varchar(4) NOT NULL,
    [CurrencySymbol] varchar(4) NULL,
    CONSTRAINT [PK_Currency] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [User] (
    [Id] uniqueidentifier NOT NULL,
    [Name] varchar(30) NOT NULL,
    [Profile] int NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [QuotationCurrency] (
    [Id] uniqueidentifier NOT NULL,
    [CountryId] uniqueidentifier NOT NULL,
    [CurrencyId] uniqueidentifier NOT NULL,
    [Value] decimal(16,8) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NULL,
    CONSTRAINT [PK_QuotationCurrency] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuotationCurrency_Country_CountryId] FOREIGN KEY ([CountryId]) REFERENCES [Country] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_QuotationCurrency_Currency_CurrencyId] FOREIGN KEY ([CurrencyId]) REFERENCES [Currency] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_QuotationCurrency_CountryId] ON [QuotationCurrency] ([CountryId]);
GO

CREATE INDEX [IX_QuotationCurrency_CurrencyId] ON [QuotationCurrency] ([CurrencyId]);
GO

COMMIT;
GO