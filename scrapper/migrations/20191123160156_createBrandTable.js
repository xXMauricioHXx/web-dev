/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('saller', (table) => {
    table.bigIncrements('id').unsigned();
    table.string('name').notNullable();
    table.string('image').notNullable();
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.unique(['name', 'image']);
  });

/**
 * @param {import('knex')} knex
 */
exports.down = (knex) => knex.schema.dropTable('saller');
