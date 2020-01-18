route
=====

Basic routing:

    function foo(year, month, day, id) {
        // ...
    };

    function bar(first, middle, last) {
        // ...
    };

    function baz(optional) {
        // ...
    };

    $.route.add({
        'foo/:year/:month/:day/:id': foo,  // Regular arguments capture a single path part
        'bar/:first/*middle/:middle': bar  // Splat arguments capture any number of path parts
        'baz[/:optional]': baz  		   // Brackets indicate optional path components
    });

	$.route.run(document.location.pathname);

Usage with Ender
----------------
After you install [Ender](http://ender.no.de), include `route` in your package:

    ender add route
