
 exports.up = async function(knex) {
    return knex.schema.createTable('coins', table => {
        table.increments('id').primary();
        table.string('code').notNullable().unique();
        table.string('name').notNullable();
        table.float('lastro').notNullable();
        table.timestamps();
    });
}


exports.down = async function(knex) {
    return knex.schema.dropTable('coins');
}
exports.config = {
    transaction: false
};

