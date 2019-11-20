# Currency challenge

Initially I wouldnt use a database for such application, making simple upsert in memory for currency values in USD, because the number of existing currency is relatively small (180 according to the UN), and also we would like to keep them up to date, therefore, I would just store those values in memory with an expiration time of a day or so. But then there is the requirement that the service must not work with non-registred coins, meaning that we would have to store a list of
supported coins and returns a bad request otherwise. 

Even though, considering that the only data we are going to store in a _worst case scenario_ would be 180 currency symbols along with their 180 currency values in USD, therefore, memory is more than enough. Then, in order to optimize performance, we would choose an in-memory solution. Allthough, we still wanna be able to have the same list in case the service resets for any external cause, for that reason we need to chose a Database (because, its not safe to simply write on files).

There is no relation at all between the data we are storing - well, you could store all pairs like BRL->EUR conversion, but that would be simply dumb - then we might choose a NoSQL database for read performance (this is mostly overengineering, because cache would handle it all with no problem in a SQL database). Since the data-model is as simple as a key value, like: `BRL:4.19`, I've choosed Redis, which is fast, usually expensive, production-safe and already has nice time eviction polices. 

It is indeed unusual to choose redis an a storage, but thats usually because the of cost you would have to store and scale a great amount of data, but as we saw, the data would be small, then cost wouldnt be a problem. Maintining a redis server (or even cluster) is really easy - and often really common -  so I dont see any problem with that, and even if there is, there are payid services like redis labs.
