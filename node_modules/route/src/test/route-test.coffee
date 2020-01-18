assert = require('assert')
route = require('route')
vows = require('vows')

equal = assert.equal

addAndRun = (r, route, path=route) ->
    result = false
    r.add route, -> result = arguments[0]
    r.run(path)
    return result

if not vows.add
    vows.add = (name, batch) -> vows.describe(name).addBatch(batch).export(module)

vows.add 'router'
    'basic routing:':
        topic: new route.Router
        '/test':
            topic: (r) -> addAndRun(r, '/test')
            'should run': (args) -> assert.isObject args
    
        '/:foo':
            topic: (r) -> addAndRun(r, '/:foo', '/bar')
            'should run': (args) -> assert.isObject args
            'should get the right :foo value': (args) -> equal args.foo, 'bar'
            
        '/*foo':
            topic: (r) -> addAndRun(r, '/*foo', '/bar/baz')
            'should run': (args) -> assert.isObject args
            'should get the right :foo value': (args) -> equal args.foo, 'bar/baz'
            
        '/*foo/:bar':
            topic: (r) -> addAndRun(r, '/*foo/:bar', '/baz/bat/quux')
            'should run': (args) -> assert.isObject args
            'should get the right :foo value': (args) -> equal args.foo, 'baz/bat'
            'should get the right :bar value': (args) -> equal args.bar, 'quux'
            
        '/prefix:foo':
            topic: (r) -> addAndRun(r, '/prefix:foo', '/prefixbar')
            'should run': (args) -> assert.isObject args
            'should get the right :foo value': (args) -> equal args.foo, 'bar'
            
        '/path/with[/optional]/parts (without optional part)':
            topic: (r) -> addAndRun(r, '/path/with[/optional]/parts', '/path/with/parts')
            'should run without the optional part': (args) -> assert.isObject args
            
        '/path/with[/optional]/parts (with optional part)':
            topic: (r) -> addAndRun(r, '/path/with[/optional]/parts', '/path/with/optional/parts')
            'should run with the optional part': (args) -> assert.isObject args

        '/path/with[/:optional]/param (without optional param)':
            topic: (r) -> addAndRun(r, '/path/with[/:optional]/param', '/path/with/param')
            'should run without the optional param': (args) -> assert.isObject args
            
        '/path/with[/:optional]/param (with optional param)':
            topic: (r) -> addAndRun(r, '/path/with[/:optional]/param', '/path/with/foo/param')
            'should run with the optional param': (args) -> assert.isObject args
            'should get the right :optional value': (args) -> equal args.optional, 'foo'

        '/path[/with]/multiple[/:optional]/parts':
            topic: (r) -> addAndRun(r, '/path/with/multiple[/:optional]/parts', '/path/with/multiple/foo/parts')
            'should run': (args) -> assert.isObject args
            'should get the right :optional value': (args) -> equal args.optional, 'foo'

    'special characters:':
        topic: new route.Router
        '/test?foo=bar,:name=bat':
            topic: (r) -> addAndRun(r, '/test?foo=bar,:name=bat', '/test?foo=bar,baz=bat')
            'should run': (args) -> assert.isObject args
            'should get the right :name value': (args) -> equal args.name, 'baz'
