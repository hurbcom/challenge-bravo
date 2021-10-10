//Verify if the keys exist.
module.exports = function(from, to, data){
    if(data.hasOwnProperty(from) && data.hasOwnProperty(to)){
        return true;
    }else{
        return false;
    }
}