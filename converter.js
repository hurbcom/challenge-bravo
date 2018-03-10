const converter = (from, to, amount, quote) => {
    let result = 0.0
    
    if (from == 'BRL') 
       result = quote[to]
    else 
        result = quote[to]/quote[from]
        
    return result
}

module.exports = converter