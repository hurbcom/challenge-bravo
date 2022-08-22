CREATE DATABASE [challenge-bravo];

CREATE TABLE [challenge-bravo].dbo.Currency (
	Coin varchar(25) NOT NULL,
	Label varchar(10) NULL,
	CONSTRAINT Currency_PK PRIMARY KEY (Coin)
);


CREATE TABLE [challenge-bravo].dbo.ConvertionFactor (
	Id bigint NOT NULL,
	Factor decimal(38,0) NULL,
	Currency1 varchar(25) NOT NULL,
	Currency2 varchar(25) NULL,
	CONSTRAINT ConvertionFactor_PK PRIMARY KEY (Id),
	CONSTRAINT ConvertionFactor_FK FOREIGN KEY (Currency1) REFERENCES [challenge-bravo].dbo.Currency(Coin),
	CONSTRAINT ConvertionFactor_FK_1 FOREIGN KEY (Currency2) REFERENCES [challenge-bravo].dbo.Currency(Coin)
);
