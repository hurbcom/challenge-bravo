Docker:
sudo docker build . --tag=microservive:latest
sudo docker run -it microservice:latest

Instalação (Ubuntu Bionic):

sudo apt install build-essential cmake git openssl libcpprest-dev libboost-log1.65-dev libboost-program-options1.65-dev sqlite3 libsqlite3-dev

wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.2.4/flyway-commandline-5.2.4-linux-x64.tar.gz | tar xvz && sudo ln -s `pwd`/flyway-5.2.4/flyway /usr/local/bin

flyway -locations=filesystem:migrations/sql/ -url=jdbc:sqlite:/tmp/microservice.db -user= -password=  migrate

cd /tmp
git clone git://github.com/SOCI/soci.git
cd soci/
mkdir build
cd build
cmake -DWITH_SQLITE3=ON ..
make
sudo make install

Em seguida build com cmake e make