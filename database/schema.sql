DROP TABLE IF EXIStS User;

create table User(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email text not null,
    password text not null
);
