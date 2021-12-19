const isNullOrEmpty = data => {

    if(typeof data === 'undefined') {
        return true
    }

    if(data === null) {
        return true
    }

    if(data === '' || data === "") {
        return true
    }

    return false
}

module.exports = {
    isNullOrEmpty
}