
/*
  Esta tabela deve ser preenchida com as moedas disponíveis na API externa (currencyapi.net) e as moedas fictícias
  criadas a partir da própria API. Isso evitará moedas sendo criadas com o mesmo nome e código, e também, economizará
  a quantidade de solicitações à API externa, tendo em vista que há um limite mensal de requisições e as cotações são
  atualizadas apenas de hora em hora.
*/

drop table if exists Currency;
create table Currency (
  id int primary key auto_increment,
  code varchar(4) unique not null,
  name varchar (128) unique not null,
  rate decimal(65,30) not null default 0,
  src enum('external', 'internal') not null,
  lastUpdate int not null default 0
);
