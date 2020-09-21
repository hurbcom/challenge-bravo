import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('currency', table => {
    table.increments('id').primary();
    table.string('codigo').notNullable();
    table.string('data').notNullable();
    table.decimal('cotacao').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('currency');
}
