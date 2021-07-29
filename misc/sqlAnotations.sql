create table auth(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email text not null,
password text not null);

insert into auth values('rafael.pereira@hurb.com','HurB@2021#')

insert into auth (email, password) values('rafael.pereira@hurb.com','HurB@2021#')
