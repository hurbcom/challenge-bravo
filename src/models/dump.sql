create table currency (
  id serial primary key,
  name varchar(70) not null,
  code varchar(6) not null unique,
  value numeric(20, 4) not null
);

insert into currency (code, name, value) values
  ('USD', 'Dólar Americano', 0),
  ('BRL', 'Real Brasileiro', 0),
  ('EUR', 'Euro', 0),
  ('BTC', 'Bitcoin', 0);
  ('ETH', 'Ethereum', 0),