import knex from 'knex';

export async function up(Knex: knex): Promise<void> {
  return Knex.schema.createTable('coins', (tbl) => {
    tbl.string('uid', 36).notNullable();
    tbl.string('name', 128).notNullable().unique();
    tbl.timestamps(true, true);
  });
}
export async function down(Knex: knex): Promise<void> {
  return Knex.schema.dropTableIfExists('coins');
}
