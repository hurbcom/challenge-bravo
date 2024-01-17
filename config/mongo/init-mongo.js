//Arquivo de execução incial: criando banco e users
db = db.getSiblingDB('coins_rate_constance');
db.createUser({
  user: 'challenge',
  pwd: 'bravo',
  roles: [
    { role: 'readWrite', db: 'coins_rate_constance' },
    { role: 'dbAdmin', db: 'coins_rate_constance' },
    { role: 'userAdmin', db: 'coins_rate_constance' }
  ]
});