INSERT INTO [challenge-bravo].dbo.Currency
(Coin, Label)
VALUES
        ('BRL', 'R$'),
        ('USD', '$'),
        ('EUR', 'EUR'),
        ('BTC', 'BTC'),
        ('ETH', 'ETH');

INSERT INTO [challenge-bravo].dbo.ConvertionFactor
(Id,Factor, Currency1, Currency2)
VALUES
    (1, 5.0, 'BRL', 'USD'),
    (2, 7.0, 'BRL', 'EUR'),
    (3, 1.5, 'USD', 'EUR');

