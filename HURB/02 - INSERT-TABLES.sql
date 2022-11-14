USE [HURB]
GO
INSERT [dbo].[Country] ([Id], [DisplayName], [ThreeLetterISORegionName]) VALUES (N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'Brazil', N'BRA')
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'6dca6de4-f5f8-4950-9e85-1814d7dfc392', N'GTA', NULL)
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'e4b45aec-bc0e-4a1e-8112-342bd1fa842b', N'BRL', N'R$')
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'0d472794-5b78-4180-8227-3623bcb28eff', N'ETH', NULL)
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'6d790360-0875-4b15-804c-5e349d4c75e9', N'USD', N'$')
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'333e98e7-b9c0-4492-abd5-7a2a073cd4de', N'HURB', NULL)
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'd7e59f4a-fbc7-4caf-8d96-b4de7ef88b2e', N'BTC', NULL)
GO
INSERT [dbo].[Currency] ([Id], [ISOCurrencySymbol], [CurrencySymbol]) VALUES (N'6df96ac6-f4a4-41ae-8540-ce476ea71a10', N'EUR', N'€')
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'3ac3a591-6376-4c77-87ac-38972a53ddbf', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'd7e59f4a-fbc7-4caf-8d96-b4de7ef88b2e', CAST(89831.00000000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:48:58.5900000' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'c867e4dd-23c8-48c1-9277-537111b3f648', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'6dca6de4-f5f8-4950-9e85-1814d7dfc392', CAST(14970.05988024 AS Decimal(16, 8)), CAST(N'2022-11-12T19:47:21.9400000' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'e05ee773-db45-462a-9456-63e16ecd169e', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'0d472794-5b78-4180-8227-3623bcb28eff', CAST(6759.26380000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:47:56.7266667' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'3eccd1af-2450-4dbf-b5f7-871c081176c4', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'6df96ac6-f4a4-41ae-8540-ce476ea71a10', CAST(5.51000000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:45:16.4466667' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'297a7687-a8cd-43af-addc-99f061d132da', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'333e98e7-b9c0-4492-abd5-7a2a073cd4de', CAST(12.11000000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:46:18.6500000' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'acb04917-d587-4940-b21b-d89b83000603', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'6d790360-0875-4b15-804c-5e349d4c75e9', CAST(5.32000000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:45:50.7933333' AS DateTime2), NULL)
GO
INSERT [dbo].[QuotationCurrency] ([Id], [CountryId], [CurrencyId], [Value], [StartDate], [EndDate]) VALUES (N'13db545a-3ec1-4faf-ad94-fb6c727e237f', N'8c78aa1c-9650-4c51-9789-9e36fb74d494', N'e4b45aec-bc0e-4a1e-8112-342bd1fa842b', CAST(1.00000000 AS Decimal(16, 8)), CAST(N'2022-11-12T19:46:03.0800000' AS DateTime2), NULL)
GO
INSERT [dbo].[User] ([Id], [Name], [Profile]) VALUES (N'3a98820e-687d-4d6c-be42-339f74d015ec', N'Administrator', 3)
GO
INSERT [dbo].[User] ([Id], [Name], [Profile]) VALUES (N'f6080296-d13d-4aad-aded-a63f0c160269', N'Analyst', 2)
GO
INSERT [dbo].[User] ([Id], [Name], [Profile]) VALUES (N'afc45768-91f8-48c8-a5f4-b57f33872778', N'User', 1)
GO
