//Service to create the rule of convertion.
module.exports = function (data){
    
    resultSet = {};
    for(key in data){
        resultSet[data[key].code] = {value: 1, pairExchange: data[key].code}
    }

    return resultSet;
}