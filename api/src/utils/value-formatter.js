module.exports = function valueFormatter(value) {
    if (isNaN(Number(value))) {
        value = value.split(',').join('.') // se não tiver "," e tentar dar join retorna undefined e pula para else
        if (!isNaN(Number(value))) {
            return value
        } else {
            return (value = undefined)
        }
    } else {
        return value
    }
}
