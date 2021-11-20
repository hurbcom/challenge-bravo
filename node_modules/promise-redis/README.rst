-------------
promise-redis
-------------

`promise-redis` is a tiny library that adds promise awareness to `node_redis`_,
the main node.js redis client. You may provide any promise-library. But if you
don't provide any, then `native JavaScript Promise`_ will be used instead.

Features:

* It is agnostic about what promise library you use. You will want to provide
  promise library of your choice (no lock-in) or just use native JavaScript
  promises.

* Nothing new to learn. `promise-redis` just lifts redis commands to return
  promises, and then exposes to you the original `node_redis`_ object. So for
  API docs visit `node_redis documentation`_.

* It is very small.

.. contents::


Installation
------------

The only dependency of `promise-redis` is `node_redis`_. To install
`promise-redis` run:

.. code-block:: bash

    npm install promise-redis


Usage
-----

Using redis with native promises is easy:

.. code-block:: javascript

    var redis = require('promise-redis')();

Now you can use ``redis`` object as usual, but each command will return
a promise:

.. code-block:: javascript

    var client = redis.createClient();
    client.set('mykey', 'myvalue')
        .then(console.log)
        .catch(console.log)

If you want to use some promise library, you need to provide factory function:

.. code-block:: javascript

    var redis = require('promise-redis')(function(resolver) {
        // do something here that provides a way to create new promise.
    });

See below for examples of integration with some well-known promise libraries.

Q
===

Integration with `Q`_ is easy. Just use ``Q.Promise`` as a factory function.

.. code-block:: javascript

    var promiseFactory = require("q").Promise,
        redis = require('promise-redis')(promiseFactory);

    // redis is the usual node_redis object. Do what you usually do with it:
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("uh oh", err);
    });

    // All your redis commands return promises now.
    client.set('mykey', 'myvalue')
        .then(console.log)
        .catch(console.log)

    // Callback style code is still supported. This can be useful if some of
    // old code still relies on callbacks.
    client.hmset('myotherkey', {'one': 1, 'two': 2}, function (err, value) {
        if (err) {
            return console.log("Error: ", err.message);
        }
        console.log(value);
    });

when
====

Integration with `when`_ is easy as well. Just use ``when.promise`` as a factory
function:

.. code-block:: javascript

    var promiseFactory = require("when").promise,
        redis = require('promise-redis')(promiseFactory);

    // redis is the usual node_redis object. Do what you usually do with it:
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("uh oh", err);
    });

    // All your redis commands return promises now.
    client.set('mykey', 'myvalue')
        .then(console.log)
        .catch(console.log)

    // Callback style code is still supported. This can be useful if some of
    // old code still relies on callbacks.
    client.hmset('myotherkey', {'one': 1, 'two': 2}, function (err, value) {
        if (err) {
            return console.log("Error: ", err.message);
        }
        console.log(value);
    });

Bluebird
========

`Bluebird`_ is a bit different, but still nothing special:

.. code-block:: javascript

    var Promise = require("bluebird"),
        redis = require('promise-redis')(function(resolver) {
            return new Promise(resolver);
        });

    // redis is the usual node_redis object. Do what you usually do with it:
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("uh oh", err);
    });

    // All your redis commands return promises now.
    client.set('mykey', 'myvalue')
        .then(console.log)
        .catch(console.log)

    // Callback style code is still supported. This can be useful if some of
    // old code still relies on callbacks.
    client.hmset('myotherkey', {'one': 1, 'two': 2}, function (err, value) {
        if (err) {
            return console.log("Error: ", err.message);
        }
        console.log(value);
    });

Other libraries
===============

Pull requests that demonstrate how other libraries can be integrated are
welcome.


Examples
--------

Here is a copy-and-paste example from "Usage" section of `node_redis
documentation`_. The example is silly and doesn't demonstrate any advantages of
promises. I use `when`_ library here, but as you already know it really doesn't
matter:

.. code-block:: javascript

    var promiseFactory = require("when").promise,
        redis = require("promise-redis")(promiseFactory),
        client = redis.createClient();

    // if you'd like to select database 3, instead of 0 (default), call
    client.select(3).then(function() { 
        console.log("Selected database 3");
    });

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val").then(console.log);
    client.hset("hash key", "hashtest 1", "some value").then(console.log);
    client.hset(["hash key", "hashtest 2", "some other value"]).then(console.log);
    client.hkeys("hash key").then(function (replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

And finally here is an example of using ``client.multi`` (it is also from
`node_redis`_ docs):

.. code-block:: javascript

    var promiseFactory = require("when").promise,
        redis = require("promise-redis")(promiseFactory),
        client = redis.createClient();

    client.sadd("bigset", "a member");
    client.sadd("bigset", "another member");

    while (set_size > 0) {
        client.sadd("bigset", "member " + set_size);
        set_size -= 1;
    }

    // multi chain
    client.multi()
        .scard("bigset")
        .smembers("bigset")
        .keys("*")
        .dbsize()
        .exec()
        .then(function (replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
        });

``client.multi`` is a constructor that returns an object, which you can use to
chain (queue) multiple redis commands together. All commands, but ``exec``,
that you issue on ``Multi`` don't start any I/O. But when ``exec`` command is
issued, all queued operations are executed atomically. ``exec`` returns a
promise.

.. _node_redis: https://github.com/mranney/node_redis
.. _`node_redis documentation`: https://github.com/mranney/node_redis#redis---a-nodejs-redis-client
.. _Q: https://github.com/kriskowal/q/
.. _when: https://github.com/cujojs/when
.. _Bluebird: https://github.com/petkaantonov/bluebird
.. _`native JavaScript Promise`: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
