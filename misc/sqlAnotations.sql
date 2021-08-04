create table User(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email text not null,
password text not null);

-- insert into User values('rafael.pereira@hurb.com','HurB@2021#')

insert into User (email, password) values('rafael.pereira@hurb.com','HurB@2021#')
