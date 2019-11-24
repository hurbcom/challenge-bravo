const db = require('text-db')('./store');

function exchange(app){
   this._db = db    
}

exchange.prototype.convert = function(obj){
    let vFrom = this._db.getItem(obj.from)
    let vTo = this._db.getItem(obj.to)

    if((!vFrom)&&(obj.from!='USD')){
        throw 'Moeda origem não cadastrada'
    }

    if((!vTo)&&(obj.to!='USD')){
        throw 'Moeda destino não cadastrada'
    }

    if(obj.from=='USD'){
        return (obj.amount*vTo.dolar)
    }

    if(obj.to=='USD'){
        return (obj.amount*vFrom.me)
    }

    return ((obj.amount*vFrom.dolar)*vTo.me).toFixed(2)
}

exchange.prototype.delete = function(moeda){
    let item = this._db.getItem(moeda)

    if(!item){
        throw 'Moeda inexistente'
    }

    this._db.removeItem(moeda)
}

module.exports = function(){
    return exchange
}