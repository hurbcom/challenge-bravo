
exports.up = function (knex) {
    return knex.schema.createTable('currencies', function (table) {
        table.increments();
        table.string('abbreviation').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('currencies')
};
