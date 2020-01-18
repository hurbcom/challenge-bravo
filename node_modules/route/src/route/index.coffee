route = exports ? (@['route'] = {})

class route.Router
    constructor: ->
        @routes = []
    
    add: (expr, fn) ->
        if typeof expr is 'object'
            routes = expr
        else
            routes = {}
            routes[expr] = fn
            
        for expr, fn of routes
            pattern = "^#{expr}$"
            
            # Escape URL Special Characters
            pattern = pattern.replace(/([?=,\/])/g, '\\$1')

            # Double brackets so we can replace them later
            pattern = pattern.replace(/\[(.*?)\]/g, '[[$1]]')

            # Replace params with group captures
            params = ['path']
            pattern = pattern.replace /(:|\*)([\w\d]+)/g, (all, op, name) ->
                params.push(name)

                switch op
                    when ':' then '([^/]*)'
                    when '*' then '(.*?)'
                    
            # Make (double) bracketed expressions optional
            pattern = pattern.replace(/\[\[(.*?)\]\]/g, '(?:$1)?')

            @routes.push({ expr: expr, params: params, pattern: new RegExp(pattern), fn: fn })

        return

    run: (path, context, one) ->
        results = []
    
        for route in @routes
            if (m = route.pattern.exec(path))
                args = {}
                for value, i in m
                    args[route.params[i]] = decodeURIComponent(value)
                
                results.push(route.fn.call(context, args))
                
                return results[0] if one
                
        return results