module.exports = ({ }) => {
    const convert = (from, to, amount) => {
        return Promise.resolve()
            .then(() => `(${amount}) ${from} -> ${to}`)
            .catch(error => {
                throw new Error(error)
            })
    }

    return ({
        convert
    })
}