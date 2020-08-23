module.exports = ({ database }) => {


    const getAll = () => {
        return database.select('*').from('currencies')
    }

    const add = (data) => {
        return database.insert(data).into('currencies')
    }

    const remove = (id) => {
        return database.table('currencies').del().where('id', id)
    }

    return ({
        getAll,
        add,
        remove
    })
}